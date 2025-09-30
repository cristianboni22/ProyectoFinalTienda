from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Boolean, ForeignKey
from ..database import Base
from sqlalchemy.orm import relationship

class Producto(Base):
    __tablename__ = "producto"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    precio = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    id_categoria = Column(Integer, ForeignKey("categoria.id"))
    id_subcategoria = Column(Integer, ForeignKey("subcategoria.id"))
    marca = Column(String(100))
    fecha_agregado = Column(TIMESTAMP)
    activo = Column(Boolean, default=True)
      
    variantes = relationship("Variante", back_populates="producto")
    imagenes = relationship("Imagen", back_populates="producto")