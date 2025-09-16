from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.pedido import PedidoCreate, Pedido
from datetime import datetime
from typing import Optional
from app.auth import get_current_user


router = APIRouter()

# Order configuration
VALID_ORDER_STATUSES = ["pendiente", "procesando", "enviado", "entregado", "cancelado"]

@router.post("/", response_model=Pedido, status_code=status.HTTP_201_CREATED)
def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        # Validate user exists
        usuario = db.query(models.Usuario).filter(models.Usuario.id == pedido.id_usuario).first()
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        # Validate coupon if provided
        if pedido.id_cupon:
            cupon = db.query(models.Cupon).filter(models.Cupon.id == pedido.id_cupon).first()
            if not cupon:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cupón no encontrado"
                )
            
            # Check coupon validity
            if cupon.fecha_expiracion and cupon.fecha_expiracion < datetime.now().date():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El cupón ha expirado"
                )
                
            if cupon.uso_maximo and cupon.veces_usado >= cupon.uso_maximo:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El cupón ha alcanzado su límite de uso"
                )

        # Validate status if provided
        if pedido.estado and pedido.estado.lower() not in VALID_ORDER_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado de pedido inválido. Válidos: {', '.join(VALID_ORDER_STATUSES)}"
            )

        # Create order with current timestamp
        db_pedido = models.Pedido(
            **pedido.dict(exclude_unset=True),
            fecha_pedido=datetime.utcnow(),
            estado=pedido.estado or "pendiente"  # Default status
        )
        db.add(db_pedido)
        db.commit()
        db.refresh(db_pedido)

        # Increment coupon usage if applied
        if pedido.id_cupon:
            cupon.veces_usado += 1
            db.commit()

        return db_pedido
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear pedido: {str(e)}"
        )

@router.get("/", response_model=list[Pedido])
def obtener_pedidos(
    estado: Optional[str] = None,
    usuario_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Pedido)
    
    if estado:
        if estado.lower() not in VALID_ORDER_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado de pedido inválido. Válidos: {', '.join(VALID_ORDER_STATUSES)}"
            )
        query = query.filter(models.Pedido.estado.ilike(estado))
    
    if usuario_id:
        query = query.filter(models.Pedido.id_usuario == usuario_id)
    
    return query.order_by(models.Pedido.fecha_pedido.desc()).all()

@router.get("/usuario/{id_usuario}", response_model=list[Pedido])
def obtener_pedidos_por_usuario(id_usuario: int, db: Session = Depends(get_db)):
    return db.query(models.Pedido).filter(
        models.Pedido.id_usuario == id_usuario
    ).order_by(models.Pedido.fecha_pedido.desc()).all()

@router.get("/{id}", response_model=Pedido)
def obtener_pedido(id: int, db: Session = Depends(get_db)):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )
    return pedido

@router.put("/{id}", response_model=Pedido)
def actualizar_pedido(
    id: int,
    estado: Optional[str] = None,
    direccion_envio: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_pedido = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )

    try:
        # Validate status if provided
        if estado:
            if estado.lower() not in VALID_ORDER_STATUSES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Estado de pedido inválido. Válidos: {', '.join(VALID_ORDER_STATUSES)}"
                )
            
            # Prevent invalid status transitions
            if (db_pedido.estado == "cancelado" and estado.lower() != "cancelado") or \
               (db_pedido.estado == "entregado" and estado.lower() != "entregado"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"No se puede cambiar el estado de un pedido {db_pedido.estado}"
                )
                
            db_pedido.estado = estado.lower()

        if direccion_envio:
            # Only allow shipping address update if order hasn't shipped
            if db_pedido.estado in ["enviado", "entregado"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No se puede actualizar la dirección para pedidos enviados o entregados"
                )
            db_pedido.direccion_envio = direccion_envio

        db.commit()
        db.refresh(db_pedido)
        return db_pedido
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar pedido: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_pedido(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_pedido = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )

    try:
        # Only allow cancellation for pending/processing orders
        if db_pedido.estado not in ["pendiente", "procesando"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se puede cancelar un pedido en estado {db_pedido.estado}"
            )
        
        db_pedido.estado = "cancelado"
        db.commit()
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al cancelar pedido: {str(e)}"
        )
    
    return None