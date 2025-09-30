from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from ..database import Base
from sqlalchemy.orm import relationship


class Variante(Base):
    __tablename__ = "variante"
    __table_args__ = (
        UniqueConstraint('id_producto', 'talla', 'color', name='uq_producto_talla_color'),
    )

    id = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("producto.id"))
    talla = Column(String(10))
    color = Column(String(30))
    stock_individual = Column(Integer)
    sku = Column(String(50))

    producto = relationship("Producto", back_populates="variantes")