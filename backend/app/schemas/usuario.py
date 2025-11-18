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

    model_config = {
        "validate_by_name": True
    } # Permite usar alias

class UsuarioOut(UsuarioBase):
    id: int
    fecha_registro: Optional[datetime] = None
    rol: str

    model_config = {
        "from_attributes": True
    }