from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemCarritoBase(BaseModel):
    id_carrito: int
    id_producto: int
    id_variante: Optional[int]
    cantidad: int

class ItemCarritoCreate(ItemCarritoBase):
    pass

class ItemCarrito(ItemCarritoBase):
    id: int

    class Config:
        from_attributes = True