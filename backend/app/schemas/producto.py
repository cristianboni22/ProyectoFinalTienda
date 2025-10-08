from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from .variante import VarianteOut,  VarianteCreate
from .imagen import ImagenOut, ImagenCreate

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
    variantes: List[VarianteCreate] = []
    imagenes: List[ImagenCreate] = []  # Puedes añadir campos específicos para creación si es necesario

class ProductoOut(ProductoBase):
    id: int
    nombre: str
    descripcion: Optional[str]
    precio: float   # hacemos conversión en el endpoint
    stock: int
    id_categoria: int
    id_subcategoria: int
    marca: Optional[str]
    activo: Optional[bool]
    variantes: List[VarianteOut] = []
    imagenes: List[ImagenOut] = [] 
    
    class Config:
        orm_mode = True
