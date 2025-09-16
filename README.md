# ProyectoFinalTienda

Backend desarrollado en FastAPI con autenticación JWT, PostgreSQL y SQLAlchemy.

🔹 Requisitos

Python ≥ 3.11

PostgreSQL (o la base de datos que uses)

Git

🔹 Instalación y ejecución automática

Clonar el proyecto

git clone https://github.com/tu_usuario/ProyectoFinalTienda.git
cd ProyectoFinalTienda


Crear entorno virtual

python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows


Instalar dependencias

pip install -r requirements.txt


Configurar base de datos
Crea un archivo .env en la raíz con tus variables, por ejemplo:

DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tienda_db
SECRET_KEY=clave_super_secreta


Crear tablas automáticamente
El backend tiene lógica para crear las tablas al iniciar, no necesitas comandos extra.

Levantar el backend

uvicorn app.main:app --reload --port 5000


Swagger UI: http://127.0.0.1:5000/docs

Redoc: http://127.0.0.1:5000/redoc

🔹 Endpoints principales
Autenticación
Método	Ruta	Descripción
POST	/register	Registro de usuario
POST	/login	Login → Devuelve JWT

Recuerda usar el token JWT en el header Authorization: Bearer <token> para las rutas protegidas.

Ejemplos de rutas protegidas

POST /carrito/ → Crear carrito

PUT /detalle_pedido/{id} → Actualizar detalle de pedido

DELETE /pedido/{id} → Eliminar pedido

Las rutas GET generalmente no requieren autenticación, mientras que POST, PUT y DELETE sí.

🔹 Tips de desarrollo

Cada vez que modifiques modelos (models.py) o schemas (schemas/*.py), reinicia el backend para que se creen las tablas nuevas si es necesario.

Variables sensibles (JWT, DB) siempre en .env, nunca subirlas a GitHub.

Para probar rutas con JWT, puedes usar Postman o Insomnia.

🔹 Comandos útiles
# Activar entorno virtual
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Levantar servidor
uvicorn app.main:app --reload --port 5000

# Crear tablas automáticamente (opcional si falla la inicialización)
python -c "from app.main import create_tables; create_tables()"