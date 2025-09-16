from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImagenBase(BaseModel):
    id_producto: int
    url_imagen: str

class ImagenCreate(ImagenBase):
    pass

class Imagen(ImagenBase):
    id: int

    class Config:
        from_attributes = True