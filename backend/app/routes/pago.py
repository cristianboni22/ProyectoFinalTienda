from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.pago import PagoCreate, Pago
from datetime import datetime
from typing import Optional
from app.auth import get_current_user,admin_required


router = APIRouter()

# Payment configuration
VALID_PAYMENT_METHODS = ["tarjeta", "transferencia", "efectivo", "paypal"]
VALID_PAYMENT_STATUSES = ["pendiente", "completado", "fallido", "reembolsado"]

@router.post("/", response_model=Pago, status_code=status.HTTP_201_CREATED)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user),admin=Depends(admin_required) ):
    try:
        # Validate order exists
        pedido = db.query(models.Pedido).filter(models.Pedido.id == pago.id_pedido).first()
        if not pedido:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado"
            )

        # Validate payment method if provided
        if pago.metodo_pago and pago.metodo_pago.lower() not in VALID_PAYMENT_METHODS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Método de pago inválido. Válidos: {', '.join(VALID_PAYMENT_METHODS)}"
            )

        # Validate payment status if provided
        if pago.estado_pago and pago.estado_pago.lower() not in VALID_PAYMENT_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado de pago inválido. Válidos: {', '.join(VALID_PAYMENT_STATUSES)}"
            )

        # Check if payment already exists for this order
        existing_payment = db.query(models.Pago).filter(
            models.Pago.id_pedido == pago.id_pedido
        ).first()
        if existing_payment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un pago para este pedido"
            )

        # Create payment with current timestamp
        db_pago = models.Pago(
            **pago.dict(),
            fecha_pago=datetime.utcnow(),
            estado_pago=pago.estado_pago or "pendiente"  # Default status
        )
        db.add(db_pago)
        db.commit()
        db.refresh(db_pago)

        # Update order status if payment is completed
        if db_pago.estado_pago.lower() == "completado":
            pedido.estado = "pagado"
            db.commit()

        return db_pago
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar pago: {str(e)}"
        )

@router.get("/", response_model=list[Pago])
def obtener_pagos(
    estado: Optional[str] = None,
    metodo: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Pago)
    
    if estado:
        if estado.lower() not in VALID_PAYMENT_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado de pago inválido. Válidos: {', '.join(VALID_PAYMENT_STATUSES)}"
            )
        query = query.filter(models.Pago.estado_pago.ilike(estado))
    
    if metodo:
        if metodo.lower() not in VALID_PAYMENT_METHODS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Método de pago inválido. Válidos: {', '.join(VALID_PAYMENT_METHODS)}"
            )
        query = query.filter(models.Pago.metodo_pago.ilike(metodo))
    
    return query.order_by(models.Pago.fecha_pago.desc()).all()

@router.get("/pedido/{id_pedido}", response_model=Pago)
def obtener_pago_por_pedido(id_pedido: int, db: Session = Depends(get_db)):
    pago = db.query(models.Pago).filter(models.Pago.id_pedido == id_pedido).first()
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado para este pedido"
        )
    return pago

@router.get("/{id}", response_model=Pago)
def obtener_pago(id: int, db: Session = Depends(get_db)):
    pago = db.query(models.Pago).filter(models.Pago.id == id).first()
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado"
        )
    return pago

@router.put("/{id}", response_model=Pago)
def actualizar_pago(
    id: int,
    estado_pago: Optional[str] = None,
    referencia_pago: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
    admin=Depends(admin_required) 
):
    db_pago = db.query(models.Pago).filter(models.Pago.id == id).first()
    if not db_pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado"
        )

    try:
        # Validate payment status if provided
        if estado_pago:
            if estado_pago.lower() not in VALID_PAYMENT_STATUSES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Estado de pago inválido. Válidos: {', '.join(VALID_PAYMENT_STATUSES)}"
                )
            db_pago.estado_pago = estado_pago.lower()

        if referencia_pago:
            db_pago.referencia_pago = referencia_pago

        db.commit()
        db.refresh(db_pago)

        # Update order status if payment status changed to completed
        if estado_pago and estado_pago.lower() == "completado":
            pedido = db.query(models.Pedido).filter(
                models.Pedido.id == db_pago.id_pedido
            ).first()
            if pedido:
                pedido.estado = "pagado"
                db.commit()

        return db_pago
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar pago: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pago(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user),admin=Depends(admin_required) ):
    db_pago = db.query(models.Pago).filter(models.Pago.id == id).first()
    if not db_pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado"
        )

    try:
        db.delete(db_pago)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar pago: {str(e)}"
        )
    
    return None