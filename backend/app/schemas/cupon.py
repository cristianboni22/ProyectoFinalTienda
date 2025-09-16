from pydantic import BaseModel
from typing import Optional
from datetime import date

class CuponBase(BaseModel):
    codigo: str
    descuento_porcentaje: Optional[float]
    descuento_fijo: Optional[float]
    fecha_expiracion: Optional[date]
    uso_maximo: Optional[int]

class CuponCreate(CuponBase):
    pass

class Cupon(CuponBase):
    id: int
    veces_usado: int

    class Config:
        from_attributes = True