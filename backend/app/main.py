from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import * 

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # o ["*"] para permitir todos http://localhost:5174
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import carrito, categoria,detalle_pedido,imagen,item_carrito,pago,pedido,producto,subcategoria,usuario,variante
from app.auth import router as auth_router
import time

app.include_router(carrito.router, prefix="/carrito", tags=["Carrito"])
app.include_router(categoria.router, prefix="/categoria", tags=["Categoria"])
#app.include_router(cupon.router, prefix="/cupon", tags=["Cupon"])
app.include_router(detalle_pedido.router, prefix="/detalle_pedido", tags=["Detalle_pedido"])
app.include_router(imagen.router, prefix="/imagen", tags=["Imagen"])
app.include_router(item_carrito.router, prefix="/item_carrito", tags=["Item_Carrito"])
app.include_router(pago.router, prefix="/pago", tags=["Pago"])
app.include_router(pedido.router, prefix="/pedido", tags=["Pedido"])
app.include_router(producto.router, prefix="/producto", tags=["Producto"])
app.include_router(subcategoria.router, prefix="/subacategoria", tags=["SubCategoria"])
app.include_router(usuario.router, prefix="/usuario", tags=["Usuario"])
app.include_router(variante.router, prefix="/variante", tags=["Variante"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])


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
                time.sleep(5) 
            else:
                print("❌ No se pudieron crear las tablas después de varios intentos")

# Llama esta función al inicio
create_tables()