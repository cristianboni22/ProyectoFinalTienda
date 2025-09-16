from sqlalchemy import Column, Integer, ForeignKey, DECIMAL
from ..database import Base

class DetallePedido(Base):
    __tablename__ = "detalles_pedido"

    id = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedido.id"))
    id_producto = Column(Integer, ForeignKey("producto.id"))
    id_variante = Column(Integer, ForeignKey("variante.id"))
    cantidad = Column(Integer)
    precio_unitario = Column(DECIMAL(10, 2))