from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.pedido import PedidoCreate, Pedido,PedidoUpdate
from app.auth import get_current_user,admin_required
from typing import Optional

router = APIRouter()
VALID_ORDER_STATUSES = ["pendiente", "procesando", "enviado", "entregado", "cancelado"]

@router.post("/", response_model=Pedido, status_code=status.HTTP_201_CREATED)
def crear_pedido(
    pedido: PedidoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    # Siempre asignamos el pedido al usuario autenticado
    db_pedido = models.Pedido(
        id_usuario=current_user.id,
        fecha_pedido=datetime.utcnow(),
        estado=pedido.estado or "pendiente",
        total=pedido.total,
        direccion_envio=pedido.direccion_envio,
    )
    db.add(db_pedido)

    db.commit()
    db.refresh(db_pedido)
    return db_pedido

@router.get("/", response_model=list[Pedido])
def obtener_pedidos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
    estado: Optional[str] = None
):
    if current_user.rol == "admin":
        query = db.query(models.Pedido)
    else:
        query = db.query(models.Pedido).filter(models.Pedido.id_usuario == current_user.id)

    if estado:
        if estado.lower() not in VALID_ORDER_STATUSES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"Estado inválido: {estado}")
        query = query.filter(models.Pedido.estado.ilike(estado.lower()))
    
    return query.order_by(models.Pedido.fecha_pedido.desc()).all()

@router.get("/{id}", response_model=Pedido)
def obtener_pedido(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not pedido or pedido.id_usuario != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    return pedido

@router.put("/{id}", response_model=Pedido)
def actualizar_pedido(
    id: int,
    pedido: PedidoUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
    admin=Depends(admin_required)
):
    db_pedido = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    if pedido.estado:
        db_pedido.estado = pedido.estado.lower()
    if pedido.direccion_envio:
        db_pedido.direccion_envio = pedido.direccion_envio

    db.commit()
    db.refresh(db_pedido)
    return db_pedido


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_pedido(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
    admin=Depends(admin_required) 
):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not pedido or pedido.id_usuario != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    pedido.estado = "cancelado"
    db.commit()
