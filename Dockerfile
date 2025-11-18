# ============================
# 1) Build del FRONTEND
# ============================
FROM node:20 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# ============================
# 2) Imagen final: FastAPI + React build
# ============================
FROM python:3.13-slim

# Crear directorio app
WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar backend
COPY backend/ ./backend

# Copiar frontend ya compilado
COPY --from=frontend-builder /frontend/build ./frontend_build

# FastAPI servirá el frontend estático
ENV FRONTEND_PATH=/app/frontend_build

# Exponer el puerto
EXPOSE 8000

# Comando de producción
CMD ["python", "backend/main.py"]
.github