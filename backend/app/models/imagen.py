from sqlalchemy import Column, Integer, Text, ForeignKey
from ..database import Base

class Imagen(Base):
    __tablename__ = "imagen"

    id = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("producto.id"))
    url_imagen = Column(Text, nullable=False)