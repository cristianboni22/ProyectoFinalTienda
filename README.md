# ProyectoFinalTienda

Backend desarrollado en FastAPI con autenticación JWT, PostgreSQL y SQLAlchemy.

🔹 Requisitos

- Python ≥ 3.11

- PostgreSQL (o la base de datos que uses)

- Git

🔹 Instalación y ejecución automática(Linux)

1. Clonar el proyecto 
~~~
git clone https://github.com/tu_usuario/ProyectoFinalTienda.git

#Comando a seguir una vez clonado
apt update
apt install python3-pip -y
pip install -r requirements.txt

apt install curl -y

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

apt install -y nodejs

node -v
npm -v
#Una vez tenemos instalado pip y npm junto con el requirement lo qeu haremos ahora sera
cd ProyectoFinalTienda/frontend
npm install
npm run build
cd..
docker-compose up -d #Para hacerlo en segundo plano
docker-compose up --build #Para hacerlo en primer plano
~~~


