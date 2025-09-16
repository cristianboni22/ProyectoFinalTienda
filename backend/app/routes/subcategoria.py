from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.subcategoria import SubcategoriaCreate, Subcategoria
from app.auth import get_current_user


router = APIRouter()

@router.post("/", response_model=Subcategoria, status_code=status.HTTP_201_CREATED)
def crear_subcategoria(subcategoria: SubcategoriaCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        # Verificar que la categoría exista
        categoria = db.query(models.Categoria).filter(models.Categoria.id == subcategoria.id_categoria).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        db_subcategoria = models.Subcategoria(**subcategoria.dict())
        db.add(db_subcategoria)
        db.commit()
        db.refresh(db_subcategoria)
        return db_subcategoria
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear subcategoría: {str(e)}")


@router.get("/", response_model=list[Subcategoria])
def obtener_subcategorias(db: Session = Depends(get_db)):
    return db.query(models.Subcategoria).all()


@router.get("/{id}", response_model=Subcategoria)
def obtener_subcategoria(id: int, db: Session = Depends(get_db)):
    subcategoria = db.query(models.Subcategoria).filter(models.Subcategoria.id == id).first()
    if not subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    return subcategoria


@router.put("/{id}", response_model=Subcategoria)
def actualizar_subcategoria(id: int, subcategoria: SubcategoriaCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_subcategoria = db.query(models.Subcategoria).filter(models.Subcategoria.id == id).first()
    if not db_subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")

    try:
        # Verifica que la nueva categoría exista
        categoria = db.query(models.Categoria).filter(models.Categoria.id == subcategoria.id_categoria).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        for key, value in subcategoria.dict().items():
            setattr(db_subcategoria, key, value)
        db.commit()
        db.refresh(db_subcategoria)
        return db_subcategoria
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar subcategoría: {str(e)}")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_subcategoria(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_subcategoria = db.query(models.Subcategoria).filter(models.Subcategoria.id == id).first()
    if not db_subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")

    try:
        db.delete(db_subcategoria)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar subcategoría: {str(e)}")

    return None
