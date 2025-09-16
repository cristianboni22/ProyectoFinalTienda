from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey
from ..database import Base

class Carrito(Base):
    __tablename__ = "carrito"

    id = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id"))
    fecha_creacion = Column(TIMESTAMP)
