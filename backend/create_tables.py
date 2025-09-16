from app import models
from app.database import engine

print("Creando tablas en la base de datos...")
models.Base.metadata.create_all(bind=engine)