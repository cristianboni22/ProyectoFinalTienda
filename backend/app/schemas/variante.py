from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VarianteBase(BaseModel):
    id_producto: int
    talla: Optional[str]
    color: Optional[str]
    stock_individual: Optional[int]
    sku: Optional[str]

class VarianteCreate(VarianteBase):
    pass

class Variante(VarianteBase):
    id: int

    class Config:
        from_attributes = True
