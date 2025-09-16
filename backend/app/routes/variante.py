from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.variante import VarianteCreate, Variante
from app.auth import get_current_user


router = APIRouter()

@router.post("/", response_model=Variante, status_code=status.HTTP_201_CREATED)
def crear_variante(variante: VarianteCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        # Verificar si el producto existe
        producto = db.query(models.Producto).filter(models.Producto.id == variante.id_producto).first()
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        db_variante = models.Variante(**variante.dict())
        db.add(db_variante)
        db.commit()
        db.refresh(db_variante)
        return db_variante
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear variante: {str(e)}")

@router.get("/", response_model=list[Variante])
def obtener_variantes(db: Session = Depends(get_db)):
    return db.query(models.Variante).all()

@router.get("/{id}", response_model=Variante)
def obtener_variante(id: int, db: Session = Depends(get_db)):
    variante = db.query(models.Variante).filter(models.Variante.id == id).first()
    if not variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")
    return variante

@router.get("/producto/{id_producto}", response_model=list[Variante])
def obtener_variantes_por_producto(id_producto: int, db: Session = Depends(get_db)):
    variantes = db.query(models.Variante).filter(models.Variante.id_producto == id_producto).all()
    if not variantes:
        raise HTTPException(status_code=404, detail="No se encontraron variantes para este producto")
    return variantes

@router.put("/{id}", response_model=Variante)
def actualizar_variante(id: int, variante: VarianteCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_variante = db.query(models.Variante).filter(models.Variante.id == id).first()
    if not db_variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")
    
    try:
        producto = db.query(models.Producto).filter(models.Producto.id == variante.id_producto).first()
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        for key, value in variante.dict().items():
            setattr(db_variante, key, value)
        db.commit()
        db.refresh(db_variante)
        return db_variante
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar variante: {str(e)}")

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_variante(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_variante = db.query(models.Variante).filter(models.Variante.id == id).first()
    if not db_variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    try:
        db.delete(db_variante)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar variante: {str(e)}")

    return None
