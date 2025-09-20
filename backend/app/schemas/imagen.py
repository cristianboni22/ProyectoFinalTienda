from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImagenBase(BaseModel):
    id_producto: int
    url_imagen: str

class ImagenCreate(ImagenBase):
    pass

class ImagenOut(ImagenBase):
    id: int
    id_producto: int
    url_imagen: str

    class Config:
        from_attributes = True