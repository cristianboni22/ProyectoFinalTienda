from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.subcategoria import SubcategoriaCreate, Subcategoria
from app.auth import get_current_user, admin_required

router = APIRouter()

# ---------------- CREAR ----------------
@router.post("/", response_model=Subcategoria, status_code=status.HTTP_201_CREATED)
def crear_subcategoria(
    subcategoria: SubcategoriaCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
    admin=Depends(admin_required)
):
    categoria = db.query(models.Categoria).filter(models.Categoria.id == subcategoria.id_categoria).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # Verificar duplicado
    existente = db.query(models.Subcategoria).filter(
        models.Subcategoria.nombre == subcategoria.nombre,
        models.Subcategoria.id_categoria == subcategoria.id_categoria
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe esta subcategoría en la categoría")

    db_subcategoria = models.Subcategoria(**subcategoria.dict())
    db.add(db_subcategoria)
    db.commit()
    db.refresh(db_subcategoria)
    return db_subcategoria

# ---------------- OBTENER TODAS ----------------
@router.get("/all", response_model=list[Subcategoria])
def obtener_todas_subcategorias(
    id_categoria: int | None = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Subcategoria)
    if id_categoria is not None:
        query = query.filter(models.Subcategoria.id_categoria == id_categoria)
    return query.all()

# ---------------- OBTENER POR ID ----------------
@router.get("/{id}", response_model=Subcategoria)
def obtener_subcategoria(id: int, db: Session = Depends(get_db)):
    sub = db.query(models.Subcategoria).filter(models.Subcategoria.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    return sub

# ---------------- ACTUALIZAR ----------------
@router.put("/{id}", response_model=Subcategoria)
def actualizar_subcategoria(
    id: int,
    subcategoria: SubcategoriaCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
    admin=Depends(admin_required)
):
    db_sub = db.query(models.Subcategoria).filter(models.Subcategoria.id == id).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")

    categoria = db.query(models.Categoria).filter(models.Categoria.id == subcategoria.id_categoria).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # Verificar duplicado
    duplicado = db.query(models.Subcategoria).filter(
        models.Subcategoria.nombre == subcategoria.nombre,
        models.Subcategoria.id_categoria == subcategoria.id_categoria,
        models.Subcategoria.id != id
    ).first()
    if duplicado:
        raise HTTPException(status_code=400, detail="Ya existe esta subcategoría en la categoría")

    for key, value in subcategoria.dict().items():
        setattr(db_sub, key, value)
    db.commit()
    db.refresh(db_sub)
    return db_sub

# ---------------- ELIMINAR ----------------
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_subcategoria(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
    admin=Depends(admin_required)
):
    db_sub = db.query(models.Subcategoria).filter(models.Subcategoria.id == id).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")

    # Opcional: verificar productos asociados antes de eliminar
    productos = db.query(models.Producto).filter(models.Producto.id_subcategoria == id).count()
    if productos > 0:
        raise HTTPException(status_code=400, detail="No se puede eliminar, tiene productos asociados")

    db.delete(db_sub)
    db.commit()
    return None
