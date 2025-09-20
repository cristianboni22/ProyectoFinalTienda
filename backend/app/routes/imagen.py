from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.imagen import ImagenCreate, ImagenOut
from app.schemas.producto import ProductoOut
import os
from typing import List
from datetime import datetime
from fastapi.responses import FileResponse

router = APIRouter()

# Configuration - should be in your settings/config
IMAGE_STORAGE_PATH = "static/images"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/", response_model=ImagenOut, status_code=status.HTTP_201_CREATED)
async def crear_imagen(id_producto: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == id_producto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Tipo no permitido: {', '.join(ALLOWED_EXTENSIONS)}")

    os.makedirs(IMAGE_STORAGE_PATH, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"product_{id_producto}_{timestamp}.{ext}"
    file_path = os.path.join(IMAGE_STORAGE_PATH, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    db_imagen = models.Imagen(id_producto=id_producto, url_imagen=f"/{file_path}")
    db.add(db_imagen)
    db.commit()
    db.refresh(db_imagen)
    return db_imagen


@router.get("/", response_model=List[ImagenOut])
def obtener_imagenes(db: Session = Depends(get_db)):
    return db.query(models.Imagen).all()

@router.get("/producto/{id_producto}", response_model=List[ImagenOut])
def obtener_imagenes_por_producto(id_producto: int, db: Session = Depends(get_db)):
    return db.query(models.Imagen).filter(
        models.Imagen.id_producto == id_producto
    ).all()

@router.get("/{id}", response_model=ImagenOut)
def obtener_imagen(id: int, db: Session = Depends(get_db)):
    productos = db.query(models.Producto).all()
    resultado = []

    for p in productos:
        # Convierte ORM a dict
        p_dict = ProductoOut.from_orm(p).model_dump()
        
        # Convierte la relación de imagenes a lista de URLs
        p_dict["imagenes"] = [img.url_imagen for img in p.imagenes] if p.imagenes else []

        resultado.append(p_dict)

    return resultado


@router.get("/{id}/file")
def servir_imagen(id: int, db: Session = Depends(get_db)):
    imagen = db.query(models.Imagen).filter(models.Imagen.id == id).first()
    if not imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )
    
    file_path = imagen.url_imagen.lstrip('/')
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo de imagen no encontrado"
        )
    
    return FileResponse(file_path)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_imagen(id: int, db: Session = Depends(get_db)):
    db_imagen = db.query(models.Imagen).filter(models.Imagen.id == id).first()
    if not db_imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )

    try:
        file_path = db_imagen.url_imagen.lstrip('/')
        db.delete(db_imagen)
        db.commit()
        
        # Delete physical file
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar imagen: {str(e)}"
        )
    
    return None