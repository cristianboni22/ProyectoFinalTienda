# app/routes/producto.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Request
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
import os, shutil

from app.database import get_db
from app import models
from app.schemas.producto import ProductoCreate, ProductoOut
from app.schemas.variante import VarianteCreate
from app.schemas.imagen import ImagenCreate

router = APIRouter()

# Carpeta para guardar imágenes
IMAGEN_FOLDER = "static/imagenes/productos"
os.makedirs(IMAGEN_FOLDER, exist_ok=True)

# ---------------------------
# Crear producto
# ---------------------------
@router.post("/", response_model=ProductoOut)
def crear_producto(producto: ProductoCreate, request: Request, db: Session = Depends(get_db)):
    db_producto = models.Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        stock=producto.stock,
        marca=producto.marca,
        activo=producto.activo,
        id_categoria=producto.id_categoria,
        id_subcategoria=producto.id_subcategoria
    )
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)

    # Crear variantes
    for var in getattr(producto, "variantes", []):
        db_var = models.Variante(id_producto=db_producto.id, **var.dict())
        db.add(db_var)

    # Crear imágenes
    for img in getattr(producto, "imagenes", []):
        url_relativa = img.url_imagen
        if url_relativa.startswith("http"):
            url_relativa = "/" + "/".join(url_relativa.split("/")[3:])  # convierte a ruta relativa
        db_img = models.Imagen(id_producto=db_producto.id, url_imagen=url_relativa)
        db.add(db_img)

    db.commit()
    db.refresh(db_producto)

    # Normalizar URLs antes de devolver
    base_url = str(request.base_url).rstrip("/")
    for img in db_producto.imagenes:
        if not img.url_imagen.startswith("http"):
            img.url_imagen = f"{base_url}{img.url_imagen}"

    return db_producto

# ---------------------------
# Listar productos
# ---------------------------
@router.get("/", response_model=List[ProductoOut])
def listar_productos(
    request: Request,
    db: Session = Depends(get_db),
    activo: Optional[bool] = None,
    id_categoria: Optional[int] = None,
    id_subcategoria: Optional[int] = None,
    precio_min: Optional[float] = None,
    precio_max: Optional[float] = None,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    query = db.query(models.Producto).options(
        selectinload(models.Producto.variantes),
        selectinload(models.Producto.imagenes)
    )

    if activo is not None:
        query = query.filter(models.Producto.activo == activo)
    if id_categoria is not None:
        query = query.filter(models.Producto.id_categoria == id_categoria)
    if id_subcategoria is not None:
        query = query.filter(models.Producto.id_subcategoria == id_subcategoria)
    if precio_min is not None:
        query = query.filter(models.Producto.precio >= precio_min)
    if precio_max is not None:
        query = query.filter(models.Producto.precio <= precio_max)

    productos = query.offset(offset).limit(limit).all()

    base_url = str(request.base_url).rstrip("/")
    for producto in productos:
        for img in producto.imagenes:
            if not img.url_imagen.startswith("http"):
                img.url_imagen = f"{base_url}{img.url_imagen}"

    return productos

# ---------------------------
# Obtener producto por ID
# ---------------------------
@router.get("/{id}", response_model=ProductoOut)
def obtener_producto(id: int, request: Request, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).options(
        selectinload(models.Producto.variantes),
        selectinload(models.Producto.imagenes)
    ).filter(models.Producto.id == id).first()

    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    base_url = str(request.base_url).rstrip("/")
    for img in producto.imagenes:
        if not img.url_imagen.startswith("http"):
            img.url_imagen = f"{base_url}{img.url_imagen}"

    return producto

# ---------------------------
# Actualizar producto
# ---------------------------
@router.put("/{id}", response_model=ProductoOut)
def actualizar_producto(id: int, producto: ProductoCreate, request: Request, db: Session = Depends(get_db)):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Actualizar campos básicos
    for field, value in producto.dict(exclude={"variantes", "imagenes"}).items():
        setattr(db_producto, field, value)

    # Actualizar variantes
    db.query(models.Variante).filter(models.Variante.id_producto == id).delete()
    for var in getattr(producto, "variantes", []):
        db_var = models.Variante(id_producto=id, **var.dict())
        db.add(db_var)

    # Actualizar imágenes si se envían nuevas
    if getattr(producto, "imagenes", []):
        db.query(models.Imagen).filter(models.Imagen.id_producto == id).delete()
        for img in producto.imagenes:
            url_relativa = img.url_imagen
            if url_relativa.startswith("http"):
                url_relativa = "/" + "/".join(url_relativa.split("/")[3:])
            db_img = models.Imagen(id_producto=id, url_imagen=url_relativa)
            db.add(db_img)

    db.commit()
    db.refresh(db_producto)

    base_url = str(request.base_url).rstrip("/")
    for img in db_producto.imagenes:
        if not img.url_imagen.startswith("http"):
            img.url_imagen = f"{base_url}{img.url_imagen}"

    return db_producto

# ---------------------------
# Eliminar producto
# ---------------------------
@router.delete("/{id}", status_code=204)
def eliminar_producto(id: int, db: Session = Depends(get_db)):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # 🧹 Eliminar imágenes del disco
    for img in db_producto.imagenes:
        # construimos ruta física real
        ruta_archivo = os.path.join(os.getcwd(), img.url_imagen.lstrip("/"))  
        print(f"🔎 Intentando eliminar archivo: {ruta_archivo}")

        if os.path.exists(ruta_archivo):
            try:
                os.remove(ruta_archivo)
                print(f"✅ Imagen eliminada: {ruta_archivo}")
            except Exception as e:
                print(f"⚠️ No se pudo eliminar {ruta_archivo}: {e}")
        else:
            print(f"❌ Archivo no encontrado: {ruta_archivo}")

    # Eliminar relaciones
    db.query(models.Imagen).filter(models.Imagen.id_producto == id).delete()
    db.query(models.Variante).filter(models.Variante.id_producto == id).delete()

    # Eliminar producto
    db.delete(db_producto)
    db.commit()

    return {"detail": "Producto e imágenes eliminados correctamente"}


# ---------------------------
# Subir imagen
# ---------------------------
@router.post("/upload-imagen/", status_code=201)
def upload_imagen(file: UploadFile = File(...)):
    ruta = os.path.join(IMAGEN_FOLDER, file.filename)
    with open(ruta, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url_imagen": f"/static/imagenes/productos/{file.filename}"}
