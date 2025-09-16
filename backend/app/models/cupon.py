from sqlalchemy import Column, Integer, String, DECIMAL, Date
from ..database import Base

class Cupon(Base):
    __tablename__ = "cupon"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, nullable=False)
    descuento_porcentaje = Column(DECIMAL(5, 2))
    descuento_fijo = Column(DECIMAL(10, 2))
    fecha_expiracion = Column(Date)
    uso_maximo = Column(Integer)
    veces_usado = Column(Integer, default=0)