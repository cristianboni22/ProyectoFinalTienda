from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from ..database import Base
from sqlalchemy.orm import relationship

class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50))
    apellido = Column(String(100))
    email = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(255), nullable=False)
    direccion = Column(Text)
    telefono = Column(String(20))
    fecha_registro = Column(TIMESTAMP)
    rol = Column(String(20), default="cliente")

    