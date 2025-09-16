from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubcategoriaBase(BaseModel):
    id_categoria: int
    nombre: str
    descripcion: Optional[str]

class SubcategoriaCreate(SubcategoriaBase):
    pass

class Subcategoria(SubcategoriaBase):
    id: int

    class Config:
        from_attributes = True
