from pydantic import BaseModel
from typing import Optional

# Schema base para categoría
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str]

# Schema para crear categoría
class CategoriaCreate(CategoriaBase):
    pass

# Schema para leer/mostrar categoría
class CategoriaOut(CategoriaBase):
    id: int

    class Config:
        from_attributes = True
