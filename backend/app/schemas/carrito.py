from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CarritoBase(BaseModel):
    id_usuario: int

class CarritoCreate(CarritoBase):
    pass

class CarritoOut(CarritoBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True