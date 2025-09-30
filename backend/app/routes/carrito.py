from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.carrito import CarritoCreate, CarritoOut
from app.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=CarritoOut, status_code=status.HTTP_201_CREATED)
def crear_carrito(
    carrito: CarritoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    # Siempre se asigna al usuario autenticado
    db_carrito = models.Carrito(
        id_usuario=current_user.id,
        fecha_creacion=datetime.utcnow()
    )
    db.add(db_carrito)
    db.commit()
    db.refresh(db_carrito)
    return db_carrito

@router.get("/", response_model=list[CarritoOut])
def obtener_carritos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    # Devuelve solo los carritos del usuario autenticado
    return db.query(models.Carrito).filter(models.Carrito.id_usuario == current_user.id).all()

@router.get("/{id}", response_model=CarritoOut)
def obtener_carrito(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    carrito = db.query(models.Carrito).filter(models.Carrito.id == id).first()
    if not carrito or carrito.id_usuario != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carrito no encontrado"
        )
    return carrito

@router.put("/{id}", response_model=CarritoOut)
def actualizar_carrito(
    id: int,
    carrito: CarritoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    db_carrito = db.query(models.Carrito).filter(models.Carrito.id == id).first()
    if not db_carrito or db_carrito.id_usuario != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carrito no encontrado")

    db_carrito.fecha_creacion = datetime.utcnow()
    db.commit()
    db.refresh(db_carrito)
    return db_carrito

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_carrito(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    db_carrito = db.query(models.Carrito).filter(models.Carrito.id == id).first()
    if not db_carrito or db_carrito.id_usuario != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carrito no encontrado")

    db.query(models.ItemCarrito).filter(models.ItemCarrito.id_carrito == id).delete()
    db.delete(db_carrito)
    db.commit()
