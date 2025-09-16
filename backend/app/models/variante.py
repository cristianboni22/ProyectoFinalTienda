from sqlalchemy import Column, Integer, String, ForeignKey
from ..database import Base

class Variante(Base):
    __tablename__ = "variante"

    id = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("producto.id"))
    talla = Column(String(10))
    color = Column(String(30))
    stock_individual = Column(Integer)
    sku = Column(String(50))