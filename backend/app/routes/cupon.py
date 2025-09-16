from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.cupon import CuponCreate, Cupon
from app.auth import get_current_user


router = APIRouter()

@router.post("/", response_model=Cupon, status_code=status.HTTP_201_CREATED)
def crear_cupon(cupon: CuponCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        # Validate that at least one discount type is provided
        if cupon.descuento_porcentaje is None and cupon.descuento_fijo is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Debe proporcionar al menos un tipo de descuento (porcentaje o fijo)"
            )

        # Validate discount values
        if cupon.descuento_porcentaje is not None and (cupon.descuento_porcentaje <= 0 or cupon.descuento_porcentaje > 100):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El descuento porcentual debe estar entre 0 y 100"
            )

        if cupon.descuento_fijo is not None and cupon.descuento_fijo <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El descuento fijo debe ser mayor que 0"
            )

        # Check if coupon code already exists
        existing_coupon = db.query(models.Cupon).filter(
            models.Cupon.codigo == cupon.codigo
        ).first()
        if existing_coupon:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un cupón con este código"
            )

        db_cupon = models.Cupon(
            **cupon.dict(),
            veces_usado=0  # Initialize usage count to 0
        )
        db.add(db_cupon)
        db.commit()
        db.refresh(db_cupon)
        return db_cupon
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear cupón: {str(e)}"
        )

@router.get("/", response_model=list[Cupon])
def obtener_cupones(activos: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.Cupon)
    if activos:
        query = query.filter(
            (models.Cupon.fecha_expiracion.is_(None)) | 
            (models.Cupon.fecha_expiracion >= date.today())
        )
    return query.all()

@router.get("/{id}", response_model=Cupon)
def obtener_cupon(id: int, db: Session = Depends(get_db)):
    cupon = db.query(models.Cupon).filter(models.Cupon.id == id).first()
    if not cupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cupón no encontrado"
        )
    return cupon

@router.get("/codigo/{codigo}", response_model=Cupon)
def obtener_cupon_por_codigo(codigo: str, db: Session = Depends(get_db)):
    cupon = db.query(models.Cupon).filter(models.Cupon.codigo == codigo).first()
    if not cupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cupón no encontrado"
        )
    
    # Check if coupon is expired
    if cupon.fecha_expiracion and cupon.fecha_expiracion < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este cupón ha expirado"
        )
    
    # Check if usage limit has been reached
    if cupon.uso_maximo and cupon.veces_usado >= cupon.uso_maximo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este cupón ha alcanzado su límite de uso"
        )
    
    return cupon

@router.put("/{id}", response_model=Cupon)
def actualizar_cupon(id: int, cupon: CuponCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_cupon = db.query(models.Cupon).filter(models.Cupon.id == id).first()
    if not db_cupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cupón no encontrado"
        )

    try:
        # Validate that at least one discount type is provided
        if cupon.descuento_porcentaje is None and cupon.descuento_fijo is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Debe proporcionar al menos un tipo de descuento (porcentaje o fijo)"
            )

        # Check if code is being changed to an existing one
        if db_cupon.codigo != cupon.codigo:
            existing_coupon = db.query(models.Cupon).filter(
                models.Cupon.codigo == cupon.codigo,
                models.Cupon.id != id
            ).first()
            if existing_coupon:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ya existe un cupón con este código"
                )

        update_data = cupon.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_cupon, key, value)
        
        db.commit()
        db.refresh(db_cupon)
        return db_cupon
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar cupón: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cupon(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_cupon = db.query(models.Cupon).filter(models.Cupon.id == id).first()
    if not db_cupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cupón no encontrado"
        )

    try:
        db.delete(db_cupon)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar cupón: {str(e)}"
        )
    
    return None

@router.post("/{id}/incrementar-uso", response_model=Cupon)
def incrementar_uso_cupon(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    db_cupon = db.query(models.Cupon).filter(models.Cupon.id == id).first()
    if not db_cupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cupón no encontrado"
        )

    try:
        # Check if coupon can still be used
        if db_cupon.uso_maximo and db_cupon.veces_usado >= db_cupon.uso_maximo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este cupón ha alcanzado su límite de uso"
            )

        if db_cupon.fecha_expiracion and db_cupon.fecha_expiracion < date.today():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este cupón ha expirado"
            )

        db_cupon.veces_usado += 1
        db.commit()
        db.refresh(db_cupon)
        return db_cupon
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al incrementar uso del cupón: {str(e)}"
        )