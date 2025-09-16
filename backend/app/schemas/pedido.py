from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PedidoBase(BaseModel):
    id_usuario: int
    estado: Optional[str] = "pendiente"
    total: Optional[float]
    direccion_envio: Optional[str]
    id_cupon: Optional[int]

class PedidoCreate(PedidoBase):
    pass

class Pedido(PedidoBase):
    id: int
    fecha_pedido: datetime

    class Config:
        from_attributes = True
