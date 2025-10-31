from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import get_db
from app import models
from app.schemas.usuario import UsuarioCreate, UsuarioOut
from app.auth import get_current_user, admin_required

router = APIRouter()

# Función para hashear contraseña
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str):
    return pwd_context.hash(password)

@router.post("/", response_model=list[UsuarioOut])
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db),get_current_user=Depends(get_current_user)):
    # Comprobar si el email ya existe
    existing_user = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # Hashear la contraseña
    hashed_password = hash_password(usuario.contrasena)

    # Crear el usuario
    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        contrasena=hashed_password,
        direccion=usuario.direccion,
        telefono=usuario.telefono,
        rol=usuario.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    # Devolver todos los usuarios para actualizar la tabla del frontend
    usuarios = db.query(models.Usuario).all()
    return usuarios

@router.get("/me", response_model=UsuarioOut)
def leer_usuario_actual(current_user: models.Usuario = Depends(get_current_user),get_current_user=Depends(get_current_user)):
    return current_user


@router.get("/", response_model=list[UsuarioOut])
def obtener_usuarios(db: Session = Depends(get_db),get_current_user=Depends(get_current_user)):
    return db.query(models.Usuario).all()

@router.get("/{id}", response_model=UsuarioOut)
def obtener_usuario(id: int, db: Session = Depends(get_db),get_current_user=Depends(get_current_user)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == id).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return usuario


@router.put("/{id}", response_model=UsuarioOut)
def editar_usuario(
    id: int,
    usuario: UsuarioCreate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id == id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Actualizar todos los campos
    db_usuario.nombre = usuario.nombre
    db_usuario.apellido = usuario.apellido
    db_usuario.email = usuario.email
    db_usuario.contrasena = hash_password(usuario.contrasena)
    db_usuario.rol = usuario.rol
    db_usuario.direccion = usuario.direccion
    db_usuario.telefono = usuario.telefono

    db.commit()
    db.refresh(db_usuario)
    return db_usuario

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
