from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.variante import VarianteCreate, VarianteOut
from app.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=VarianteOut, status_code=status.HTTP_201_CREATED)
def crear_variante(
    variante: VarianteCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # Verificar si el producto existe
    producto = db.query(models.Producto).filter(models.Producto.id == variante.id_producto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Validar que no exista otra variante con la misma combinación talla+color
    existe = db.query(models.Variante).filter(
        models.Variante.id_producto == variante.id_producto,
        models.Variante.talla == variante.talla,
        models.Variante.color == variante.color
    ).first()
    if existe:
        raise HTTPException(
            status_code=400,
            detail=f"La variante con talla '{variante.talla}' y color '{variante.color}' ya existe para este producto."
        )

    # Crear la variante
    db_variante = models.Variante(**variante.dict())
    db.add(db_variante)
    db.commit()
    db.refresh(db_variante)
    return db_variante


@router.put("/{id}", response_model=VarianteOut)
def actualizar_variante(
    id: int,
    variante: VarianteCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_variante = db.query(models.Variante).filter(models.Variante.id == id).first()
    if not db_variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    # Validar que el producto exista
    producto = db.query(models.Producto).filter(models.Producto.id == variante.id_producto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Validar que no duplique otra combinación talla+color
    existe = db.query(models.Variante).filter(
        models.Variante.id_producto == variante.id_producto,
        models.Variante.talla == variante.talla,
        models.Variante.color == variante.color,
        models.Variante.id != id  # excluye la variante actual
    ).first()
    if existe:
        raise HTTPException(
            status_code=400,
            detail=f"Ya existe una variante con talla '{variante.talla}' y color '{variante.color}' para este producto."
        )

    # Actualizar campos
    for key, value in variante.dict().items():
        setattr(db_variante, key, value)

    db.commit()
    db.refresh(db_variante)
    return db_variante


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_variante(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_variante = db.query(models.Variante).filter(models.Variante.id == id).first()
    if not db_variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    db.delete(db_variante)
    db.commit()
    return None
