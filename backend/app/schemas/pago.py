from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PagoBase(BaseModel):
    id_pedido: int
    metodo_pago: Optional[str]
    estado_pago: Optional[str]
    referencia_pago: Optional[str]

class PagoCreate(PagoBase):
    pass

class Pago(PagoBase):
    id: int
    fecha_pago: datetime

    class Config:
        from_attributes = True