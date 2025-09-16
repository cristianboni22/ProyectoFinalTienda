from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from ..database import Base

class Pago(Base):
    __tablename__ = "pago"

    id = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedido.id"))
    metodo_pago = Column(String(50))
    estado_pago = Column(String(20))
    fecha_pago = Column(TIMESTAMP)
    referencia_pago = Column(String(100))