from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.database import get_db
from app import models, schemas  # <-- Aquí tu UsuarioCreate
from app.schemas.usuario import UsuarioCreate, UsuarioOut
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "clave_super_secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        
        user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")
        return user
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# ------------------ REGISTER ------------------
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UsuarioCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.Usuario).filter(models.Usuario.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario ya registrado")

    hashed_password = get_password_hash(user.contrasena)
    db_user = models.Usuario(
        nombre=user.nombre,
        apellido=user.apellido,
        email=user.email,
        direccion=user.direccion,
        telefono=user.telefono,
        rol=user.rol,
        contrasena=hashed_password,
        fecha_registro=datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "Usuario registrado exitosamente", "user": {"id": db_user.id, "email": db_user.email}}

# ------------------ LOGIN ------------------
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.contrasena):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.email, "nombre": user.nombre, "rol": user.rol, "id": user.id}, 
        expires_delta=token_expires
    )
    return {"access_token": token, "token_type": "bearer"}  


