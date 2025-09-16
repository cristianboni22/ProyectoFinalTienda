from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.carrito import CarritoCreate, CarritoOut
from app.auth import get_current_user


router = APIRouter()

@router.post("/", response_model=CarritoOut, status_code=status.HTTP_201_CREATED)
def crear_carrito(carrito: CarritoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        # Verificar si el usuario existe primero
        usuario = db.query(models.Usuario).filter(models.Usuario.id == carrito.id_usuario).first()
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
            
        db_carrito = models.Carrito(
            id_usuario=carrito.id_usuario,
            fecha_creacion=datetime.utcnow()
        )
        db.add(db_carrito)
        db.commit()
        db.refresh(db_carrito)
        return db_carrito
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear carrito: {str(e)}"
        )

@router.get("/", response_model=list[CarritoOut])
def obtener_carritos(db: Session = Depends(get_db)):
    return db.query(models.Carrito).all()

@router.get("/{id}", response_model=CarritoOut)
def obtener_carrito(id: int, db: Session = Depends(get_db)):
    carrito = db.query(models.Carrito).filter(models.Carrito.id == id).first()
    if not carrito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carrito no encontrado"
        )
    return carrito

@router.get("/usuario/{id_usuario}", response_model=CarritoOut)
def obtener_carrito_por_usuario(id_usuario: int, db: Session = Depends(get_db)):
    carrito = db.query(models.Carrito).filter(models.Carrito.id_usuario == id_usuario).first()
    if not carrito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carrito no encontrado para este usuario"
        )
    return carrito

@router.put("/{id}", response_model=CarritoOut)
def actualizar_carrito(id: int, carrito: CarritoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_carrito = db.query(models.Carrito).filter(models.Carrito.id == id).first()
    if not db_carrito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carrito no encontrado"
        )
    
    try:
        # Verificar si el nuevo usuario existe
        usuario = db.query(models.Usuario).filter(models.Usuario.id == carrito.id_usuario).first()
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
            
        db_carrito.id_usuario = carrito.id_usuario
        db.commit()
        db.refresh(db_carrito)
        return db_carrito
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar carrito: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_carrito(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_carrito = db.query(models.Carrito).filter(models.Carrito.id == id).first()
    if not db_carrito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carrito no encontrado"
        )
    
    try:
        # Primero eliminar los items del carrito si existen
        db.query(models.ItemCarrito).filter(models.ItemCarrito.id_carrito == id).delete()
        db.delete(db_carrito)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar carrito: {str(e)}"
        )
    
    return None