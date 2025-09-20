from app.routes import carrito
from app.routes import categoria
from app.routes import cupon
from app.routes import detalle_pedido
from app.routes import imagen
from app.routes import item_carrito
from app.routes import pago
from app.routes import pedido
from app.routes import producto
from app.routes import subcategoria
from app.routes import usuario
from app.routes import variante
from app.auth import router as auth_router
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # o ["*"] para permitir todos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(carrito.router, prefix="/carrito", tags=["Carrito"])
app.include_router(categoria.router, prefix="/categoria", tags=["Categoria"])
app.include_router(cupon.router, prefix="/cupon", tags=["Cupon"])
app.include_router(detalle_pedido.router, prefix="/detalle_pedido", tags=["Detalle_pedido"])
app.include_router(imagen.router, prefix="/imagen", tags=["Imagen"])
app.include_router(item_carrito.router, prefix="/item_carrito", tags=["Item_Carrito"])
app.include_router(pago.router, prefix="/pago", tags=["Pago"])
app.include_router(pedido.router, prefix="/pedido", tags=["Pedido"])
app.include_router(producto.router, prefix="/producto", tags=["Producto"])
app.include_router(subcategoria.router, prefix="/subacategoria", tags=["SubCategoria"])
app.include_router(usuario.router, prefix="/usuario", tags=["Usuario"])
app.include_router(variante.router, prefix="/variante", tags=["Variante"])


from app.database import Base, engine
from app.models import *  # Importa todos los modelos


#Crear todas las tablas de la base de datos
def create_tables():
    print("⏳ Intentando crear tablas...")
    max_retries = 5
    for attempt in range(max_retries):
        try:
            print(f"📋 Tablas detectadas: {list(Base.metadata.tables.keys())}")
            Base.metadata.create_all(bind=engine)
            print("✅ Tablas creadas exitosamente")
            break
        except Exception as e:
            print(f"⚠️ Intento {attempt + 1} fallido: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(5)  # Espera 5 segundos antes de reintentar
            else:
                print("❌ No se pudieron crear las tablas después de varios intentos")

# Llama esta función al inicio
create_tables()