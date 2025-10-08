from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PedidoBase(BaseModel):
    estado: Optional[str] = "pendiente"
    total: Optional[float]
    direccion_envio: str               

class PedidoCreate(PedidoBase):
    pass

class Pedido(PedidoBase):
    id: int
    fecha_pedido: datetime

    class Config:
        from_attributes = True

class PedidoUpdate(BaseModel):
    estado: Optional[str] = None
    direccion_envio: Optional[str] = None