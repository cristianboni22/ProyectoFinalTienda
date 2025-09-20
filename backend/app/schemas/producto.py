from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class ProductoBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    precio: float = Field(..., gt=0)
    stock: Optional[int] = Field(0, ge=0)
    id_categoria: int
    id_subcategoria: int
    marca: Optional[str] = Field(None, max_length=100)
    activo: Optional[bool] = True

class ProductoCreate(ProductoBase):
    pass  # Puedes añadir campos específicos para creación si es necesario

class ProductoOut(ProductoBase):
    id: int
    nombre: str
    descripcion: str
    precio: float
    stock: int
    imagenes: list[str] = []  

    model_config = {
        "from_attributes": True
    }