from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class VarianteBase(BaseModel):
    talla: Optional[str]
    color: Optional[str]
    stock_individual: Optional[int] = Field(0, ge=0) 
    sku: Optional[str]

    @validator("talla", "color", pre=True, always=True)
    def empty_string_to_none(cls, v):
        return v or None

class VarianteCreate(VarianteBase):
    pass

class VarianteOut(VarianteBase):
    id: int
    id_producto: int
    talla: Optional[str]  # antes era str
    color: Optional[str]  # antes era str
    stock_individual: Optional[int]
    sku: Optional[str]


    class Config:
        orm_mode = True

