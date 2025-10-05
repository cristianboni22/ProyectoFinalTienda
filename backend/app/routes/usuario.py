from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.usuario import UsuarioCreate, UsuarioOut
from app.auth import get_current_user, admin_required


router = APIRouter()


@router.get("/me", response_model=UsuarioOut)
def leer_usuario_actual(current_user: models.Usuario = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=list[UsuarioOut])
def obtener_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

@router.get("/{id}", response_model=UsuarioOut)
def obtener_usuario(id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == id).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return usuario


@router.put("/{id}", response_model=UsuarioOut)
def actualizar_usuario(id: int, usuario: UsuarioCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user),admin=Depends(admin_required) ):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id == id).first()
    if not db_usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    try:
        update_data = usuario.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_usuario, key, value)
        db.commit()
        db.refresh(db_usuario)
        return db_usuario
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar usuario: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user),admin=Depends(admin_required) ):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id == id).first()
    if not db_usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    db.delete(db_usuario)
    db.commit()
    return None
