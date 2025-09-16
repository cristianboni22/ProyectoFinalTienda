from sqlalchemy import Column, Integer, String, Text, ForeignKey
from ..database import Base

class Subcategoria(Base):
    __tablename__ = "subcategoria"

    id = Column(Integer, primary_key=True, index=True)
    id_categoria = Column(Integer, ForeignKey("categoria.id"))
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)