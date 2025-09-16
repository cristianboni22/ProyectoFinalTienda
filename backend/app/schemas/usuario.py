from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: str
    direccion: Optional[str] = None
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contrasena: str = Field(..., alias="contraseña")  # Permite ambos nombres
    rol: Optional[str] = "cliente"

    class Config:
        allow_population_by_field_name = True  # Permite usar alias

class UsuarioOut(UsuarioBase):
    id: int
    fecha_registro: Optional[datetime]
    rol: str

    class Config:
        orm_mode = True