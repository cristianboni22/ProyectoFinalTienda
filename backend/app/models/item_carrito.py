from sqlalchemy import Column, Integer, ForeignKey
from ..database import Base

class ItemCarrito(Base):
    __tablename__ = "items_carrito"

    id = Column(Integer, primary_key=True, index=True)
    id_carrito = Column(Integer, ForeignKey("carrito.id"))
    id_producto = Column(Integer, ForeignKey("producto.id"))
    id_variante = Column(Integer, ForeignKey("variante.id"))
    cantidad = Column(Integer, nullable=False)