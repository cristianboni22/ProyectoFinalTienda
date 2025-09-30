from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app import models
from app.schemas.producto import ProductoCreate, ProductoOut
from app.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ProductoOut, status_code=status.HTTP_201_CREATED)
def crear_producto(
    producto: ProductoCreate, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
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


@router.get("/", response_model=List[ProductoOut])
def obtener_productos(
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
        # Relaciones grandes cargadas eficientemente
        selectinload(models.Producto.variantes),
        selectinload(models.Producto.imagenes)
    )

    # Filtros dinámicos
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

    total = query.count()  # Para saber el total de productos
    productos = query.offset(offset).limit(limit).all()

    return productos


@router.get("/{id}", response_model=ProductoOut)
def obtener_producto(id: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).options(
        selectinload(models.Producto.variantes),
        selectinload(models.Producto.imagenes)
    ).filter(models.Producto.id == id).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto


@router.put("/{id}", response_model=ProductoOut)
def actualizar_producto(
    id: int, 
    producto: ProductoCreate, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    try:
        update_data = producto.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_producto, key, value)
        db.commit()
        db.refresh(db_producto)
        return db_producto
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al actualizar producto: {str(e)}")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    id: int, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    # En lugar de eliminar, marcamos como inactivo
    db_producto.activo = False
    db.commit()
    return None
