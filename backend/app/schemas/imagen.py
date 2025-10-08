from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImagenBase(BaseModel):
    url_imagen: str

class ImagenCreate(ImagenBase):
    pass

class ImagenOut(ImagenBase):
    id: int
    url_imagen: str

    class Config:
        from_attributes = True