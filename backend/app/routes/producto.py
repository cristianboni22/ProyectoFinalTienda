from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.producto import ProductoCreate, ProductoOut
from app.auth import get_current_user


router = APIRouter()

@router.post("/", response_model=ProductoOut, status_code=status.HTTP_201_CREATED)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        db_producto = models.Producto(
            **producto.dict(exclude_unset=True),
            fecha_agregado=datetime.utcnow()
        )
        db.add(db_producto)
        db.commit()
        db.refresh(db_producto)
        return db_producto
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear producto: {str(e)}"
        )

@router.get("/", response_model=list[ProductoOut])
def obtener_productos(activo: bool = True, db: Session = Depends(get_db)):
    return db.query(models.Producto).filter(models.Producto.activo == activo).all()

@router.get("/{id}", response_model=ProductoOut)
def obtener_producto(id: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto

@router.put("/{id}", response_model=ProductoOut)
def actualizar_producto(id: int, producto: ProductoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    try:
        update_data = producto.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_producto, key, value)
        db.commit()
        db.refresh(db_producto)
        return db_producto
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar producto: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    # Cambio recomendado: En lugar de eliminar, marcamos como inactivo
    db_producto.activo = False
    db.commit()
    return None