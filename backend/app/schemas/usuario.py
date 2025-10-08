from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: str
    direccion: Optional[str] = None
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    nombre: str
    apellido: str
    email: EmailStr
    contrasena: str
    direccion: str = ""
    telefono: str = ""
    rol: str = "cliente"

    class Config:
        allow_population_by_field_name = True  # Permite usar alias

class UsuarioOut(UsuarioBase):
    id: int
    fecha_registro: Optional[datetime]
    rol: str

    class Config:
        orm_mode = True