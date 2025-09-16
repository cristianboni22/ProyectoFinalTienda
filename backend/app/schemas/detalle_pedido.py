from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DetallePedidoBase(BaseModel):
    id_pedido: int
    id_producto: int
    id_variante: Optional[int]
    cantidad: int
    precio_unitario: float

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedido(DetallePedidoBase):
    id: int

    class Config:
        from_attributes = True