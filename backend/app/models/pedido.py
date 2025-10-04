from sqlalchemy import Column, Integer, DECIMAL, String, TIMESTAMP, Text, ForeignKey
from ..database import Base
from sqlalchemy.orm import relationship

class Pedido(Base):
    __tablename__ = "pedido"

    id = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id"))
    fecha_pedido = Column(TIMESTAMP)
    estado = Column(String(20), default="pendiente")
    total = Column(DECIMAL(10, 2))
    direccion_envio = Column(Text)
