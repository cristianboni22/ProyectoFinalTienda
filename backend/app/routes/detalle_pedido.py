from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.detalle_pedido import DetallePedidoCreate, DetallePedido
from sqlalchemy import func
from app.auth import get_current_user


router = APIRouter()

@router.post("/", response_model=DetallePedido, status_code=status.HTTP_201_CREATED)
def crear_detalle_pedido(detalle: DetallePedidoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        # Validate order exists
        pedido = db.query(models.Pedido).filter(models.Pedido.id == detalle.id_pedido).first()
        if not pedido:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )

        # Validate product exists
        producto = db.query(models.Producto).filter(models.Producto.id == detalle.id_producto).first()
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )

        # Validate variant exists if provided
        if detalle.id_variante:
            variante = db.query(models.VarianteProducto).filter(
                models.VarianteProducto.id == detalle.id_variante,
                models.VarianteProducto.id_producto == detalle.id_producto
            ).first()
            if not variante:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Variante no encontrada para este producto"
                )

        # Validate quantity
        if detalle.cantidad <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cantidad debe ser mayor que 0"
            )

        # Validate price
        if detalle.precio_unitario <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El precio unitario debe ser mayor que 0"
            )

        db_detalle = models.DetallePedido(**detalle.dict())
        db.add(db_detalle)
        db.commit()
        db.refresh(db_detalle)
        
        # Update order total (assuming you have this field)
        _actualizar_total_pedido(detalle.id_pedido, db)
        
        return db_detalle
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear detalle de pedido: {str(e)}"
        )

@router.get("/", response_model=list[DetallePedido])
def obtener_detalles_pedido(db: Session = Depends(get_db)):
    return db.query(models.DetallePedido).all()

@router.get("/pedido/{id_pedido}", response_model=list[DetallePedido])
def obtener_detalles_por_pedido(id_pedido: int, db: Session = Depends(get_db)):
    return db.query(models.DetallePedido).filter(
        models.DetallePedido.id_pedido == id_pedido
    ).all()

@router.get("/{id}", response_model=DetallePedido)
def obtener_detalle_pedido(id: int, db: Session = Depends(get_db)):
    detalle = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not detalle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detalle de pedido no encontrado"
        )
    return detalle

@router.put("/{id}", response_model=DetallePedido)
def actualizar_detalle_pedido(id: int, detalle: DetallePedidoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_detalle = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not db_detalle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detalle de pedido no encontrado"
        )

    try:
        # Validate order exists if changed
        if db_detalle.id_pedido != detalle.id_pedido:
            pedido = db.query(models.Pedido).filter(models.Pedido.id == detalle.id_pedido).first()
            if not pedido:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Nuevo pedido no encontrado"
                )

        # Validate product exists if changed
        if db_detalle.id_producto != detalle.id_producto:
            producto = db.query(models.Producto).filter(models.Producto.id == detalle.id_producto).first()
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Nuevo producto no encontrado"
                )

        # Validate variant exists if changed
        if detalle.id_variante and (db_detalle.id_variante != detalle.id_variante or 
                                  db_detalle.id_producto != detalle.id_producto):
            variante = db.query(models.VarianteProducto).filter(
                models.VarianteProducto.id == detalle.id_variante,
                models.VarianteProducto.id_producto == detalle.id_producto
            ).first()
            if not variante:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Nueva variante no encontrada para este producto"
                )

        # Validate quantity
        if detalle.cantidad <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cantidad debe ser mayor que 0"
            )

        # Validate price
        if detalle.precio_unitario <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El precio unitario debe ser mayor que 0"
            )

        old_pedido_id = db_detalle.id_pedido
        update_data = detalle.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_detalle, key, value)
        
        db.commit()
        db.refresh(db_detalle)
        
        # Update both old and new order totals if order changed
        if old_pedido_id != db_detalle.id_pedido:
            _actualizar_total_pedido(old_pedido_id, db)
        _actualizar_total_pedido(db_detalle.id_pedido, db)
        
        return db_detalle
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar detalle de pedido: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_detalle_pedido(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_detalle = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not db_detalle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detalle de pedido no encontrado"
        )

    try:
        pedido_id = db_detalle.id_pedido
        db.delete(db_detalle)
        db.commit()
        
        # Update order total after deletion
        _actualizar_total_pedido(pedido_id, db)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar detalle de pedido: {str(e)}"
        )
    
    return None

def _actualizar_total_pedido(self, pedido_id: int, db: Session):
    """Helper method to update order total"""
    total = db.query(
        func.sum(models.DetallePedido.cantidad * models.DetallePedido.precio_unitario)
    ).filter(
        models.DetallePedido.id_pedido == pedido_id
    ).scalar() or 0.0

    db.query(models.Pedido).filter(models.Pedido.id == pedido_id).update(
        {"total": total}
    )
    db.commit()