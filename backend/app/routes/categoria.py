from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.categoria import CategoriaCreate, CategoriaOut
from app.auth import get_current_user, admin_required

router = APIRouter()

# Crear categoría
@router.post("/", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED)
def crear_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
    admin=Depends(admin_required)
):
    try:
        # Verificar si ya existe una categoría con el mismo nombre
        existe_categoria = db.query(models.Categoria).filter(
            models.Categoria.nombre == categoria.nombre
        ).first()
        if existe_categoria:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe una categoría con este nombre"
            )

        db_categoria = models.Categoria(**categoria.dict())
        db.add(db_categoria)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear categoría: {str(e)}"
        )

# Obtener todas las categorías
@router.get("/", response_model=list[CategoriaOut])
def obtener_categorias(db: Session = Depends(get_db)):
    return db.query(models.Categoria).all()

# Obtener categoría por ID
@router.get("/{id}", response_model=CategoriaOut)
def obtener_categoria(id: int, db: Session = Depends(get_db)):
    categoria = db.query(models.Categoria).filter(models.Categoria.id == id).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    return categoria

# Actualizar categoría
@router.put("/{id}", response_model=CategoriaOut)
def actualizar_categoria(
    id: int,
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
    admin=Depends(admin_required)
):
    db_categoria = db.query(models.Categoria).filter(models.Categoria.id == id).first()
    if not db_categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    
    try:
        # Verificar si el nuevo nombre ya existe en otra categoría
        if db_categoria.nombre != categoria.nombre:
            existe_categoria = db.query(models.Categoria).filter(
                models.Categoria.nombre == categoria.nombre,
                models.Categoria.id != id
            ).first()
            if existe_categoria:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ya existe otra categoría con este nombre"
                )
        for key, value in categoria.dict().items():
            setattr(db_categoria, key, value)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar categoría: {str(e)}"
        )

# Eliminar categoría
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
    admin=Depends(admin_required)
):
    db_categoria = db.query(models.Categoria).filter(models.Categoria.id == id).first()
    if not db_categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    try:
        # Verificar si hay subcategorías asociadas a esta categoría
        subcategorias_asociadas = db.query(models.Subcategoria).filter(
            models.Subcategoria.id_categoria == id
        ).count()
        if subcategorias_asociadas > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se puede eliminar la categoría porque tiene subcategorías asociadas"
            )

        db.delete(db_categoria)
        db.commit()
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar categoría: {str(e)}"
        )
    return None
