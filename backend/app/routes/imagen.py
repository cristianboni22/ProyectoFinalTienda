from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.imagen import ImagenCreate, Imagen
import os
from typing import List
from datetime import datetime
from fastapi.responses import FileResponse

router = APIRouter()

# Configuration - should be in your settings/config
IMAGE_STORAGE_PATH = "static/images"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/", response_model=Imagen, status_code=status.HTTP_201_CREATED)
async def crear_imagen(
    id_producto: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Validate product exists
        producto = db.query(models.Producto).filter(models.Producto.id == id_producto).first()
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )

        # Validate file
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo de archivo no permitido. Use: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Check file size
        file.file.seek(0, 2)  # Move to end of file
        file_size = file.file.tell()
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El archivo es demasiado grande. Tamaño máximo: {MAX_FILE_SIZE//(1024*1024)}MB"
            )
        file.file.seek(0)  # Reset file pointer

        # Create directory if not exists
        os.makedirs(IMAGE_STORAGE_PATH, exist_ok=True)

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"product_{id_producto}_{timestamp}.{file_extension}"
        file_path = os.path.join(IMAGE_STORAGE_PATH, filename)

        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Create database record
        db_imagen = models.Imagen(
            id_producto=id_producto,
            url_imagen=f"/{file_path}"  # Store relative path
        )
        db.add(db_imagen)
        db.commit()
        db.refresh(db_imagen)
        
        return db_imagen
    except HTTPException:
        raise
    except Exception as e:
        # Clean up if file was saved but DB failed
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear imagen: {str(e)}"
        )

@router.get("/", response_model=List[Imagen])
def obtener_imagenes(db: Session = Depends(get_db)):
    return db.query(models.Imagen).all()

@router.get("/producto/{id_producto}", response_model=List[Imagen])
def obtener_imagenes_por_producto(id_producto: int, db: Session = Depends(get_db)):
    return db.query(models.Imagen).filter(
        models.Imagen.id_producto == id_producto
    ).all()

@router.get("/{id}", response_model=Imagen)
def obtener_imagen(id: int, db: Session = Depends(get_db)):
    imagen = db.query(models.Imagen).filter(models.Imagen.id == id).first()
    if not imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )
    return imagen

@router.get("/{id}/file")
def servir_imagen(id: int, db: Session = Depends(get_db)):
    imagen = db.query(models.Imagen).filter(models.Imagen.id == id).first()
    if not imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )
    
    file_path = imagen.url_imagen.lstrip('/')
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo de imagen no encontrado"
        )
    
    return FileResponse(file_path)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_imagen(id: int, db: Session = Depends(get_db)):
    db_imagen = db.query(models.Imagen).filter(models.Imagen.id == id).first()
    if not db_imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )

    try:
        file_path = db_imagen.url_imagen.lstrip('/')
        db.delete(db_imagen)
        db.commit()
        
        # Delete physical file
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar imagen: {str(e)}"
        )
    
    return None