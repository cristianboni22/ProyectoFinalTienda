from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.item_carrito import ItemCarritoCreate, ItemCarrito
from app.auth import get_current_user,admin_required


router = APIRouter()

@router.post("/", response_model=ItemCarrito, status_code=status.HTTP_201_CREATED)
def crear_item_carrito(item: ItemCarritoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    try:
        # Validate cart exists
        carrito = db.query(models.Carrito).filter(models.Carrito.id == item.id_carrito).first()
        if not carrito:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carrito no encontrado"
            )

        # Validate product exists and is active
        producto = db.query(models.Producto).filter(
            models.Producto.id == item.id_producto,
            models.Producto.activo == True
        ).first()
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado o no disponible"
            )

        # Validate variant exists and belongs to product if provided
        if item.id_variante:
            variante = db.query(models.VarianteProducto).filter(
                models.VarianteProducto.id == item.id_variante,
                models.VarianteProducto.id_producto == item.id_producto,
                models.VarianteProducto.activo == True
            ).first()
            if not variante:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Variante no encontrada o no disponible para este producto"
                )

            # Check variant stock
            if variante.stock < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"No hay suficiente stock. Disponible: {variante.stock}"
                )
        else:
            # Check product stock
            if producto.stock < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"No hay suficiente stock. Disponible: {producto.stock}"
                )

        # Check if item already exists in cart
        existing_item = db.query(models.ItemCarrito).filter(
            models.ItemCarrito.id_carrito == item.id_carrito,
            models.ItemCarrito.id_producto == item.id_producto,
            models.ItemCarrito.id_variante == item.id_variante
        ).first()

        if existing_item:
            # Update quantity if item already exists
            new_quantity = existing_item.cantidad + item.cantidad
            max_stock = variante.stock if item.id_variante else producto.stock
            
            if new_quantity > max_stock:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cantidad excede el stock disponible. Máximo permitido: {max_stock}"
                )
                
            existing_item.cantidad = new_quantity
            db.commit()
            db.refresh(existing_item)
            return existing_item
        else:
            # Create new item
            if item.cantidad <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La cantidad debe ser mayor que 0"
                )

            db_item = models.ItemCarrito(**item.dict())
            db.add(db_item)
            db.commit()
            db.refresh(db_item)
            return db_item

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al agregar item al carrito: {str(e)}"
        )

@router.get("/", response_model=list[ItemCarrito])
def obtener_items_carrito(db: Session = Depends(get_db)):
    return db.query(models.ItemCarrito).all()

@router.get("/carrito/{id_carrito}", response_model=list[ItemCarrito])
def obtener_items_por_carrito(id_carrito: int, db: Session = Depends(get_db)):
    return db.query(models.ItemCarrito).filter(
        models.ItemCarrito.id_carrito == id_carrito
    ).all()

@router.get("/{id}", response_model=ItemCarrito)
def obtener_item_carrito(id: int, db: Session = Depends(get_db)):
    item = db.query(models.ItemCarrito).filter(models.ItemCarrito.id == id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item de carrito no encontrado"
        )
    return item

@router.put("/{id}", response_model=ItemCarrito)
def actualizar_item_carrito(id: int, item: ItemCarritoCreate, db: Session = Depends(get_db),current_user: str = Depends(get_current_user),admin=Depends(admin_required) ):
    db_item = db.query(models.ItemCarrito).filter(models.ItemCarrito.id == id).first()
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item de carrito no encontrado"
        )

    try:
        # Validate product and stock if changing product/variant
        if db_item.id_producto != item.id_producto or db_item.id_variante != item.id_variante:
            producto = db.query(models.Producto).filter(
                models.Producto.id == item.id_producto,
                models.Producto.activo == True
            ).first()
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Nuevo producto no encontrado o no disponible"
                )

            if item.id_variante:
                variante = db.query(models.VarianteProducto).filter(
                    models.VarianteProducto.id == item.id_variante,
                    models.VarianteProducto.id_producto == item.id_producto,
                    models.VarianteProducto.activo == True
                ).first()
                if not variante:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Nueva variante no encontrada o no disponible para este producto"
                    )
                
                if variante.stock < item.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"No hay suficiente stock. Disponible: {variante.stock}"
                    )
            else:
                if producto.stock < item.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"No hay suficiente stock. Disponible: {producto.stock}"
                    )

        # Validate quantity
        if item.cantidad <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cantidad debe ser mayor que 0"
            )

        # Update item
        db_item.id_carrito = item.id_carrito
        db_item.id_producto = item.id_producto
        db_item.id_variante = item.id_variante
        db_item.cantidad = item.cantidad
        
        db.commit()
        db.refresh(db_item)
        return db_item
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar item de carrito: {str(e)}"
        )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_item_carrito(id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user),admin=Depends(admin_required) ):
    db_item = db.query(models.ItemCarrito).filter(models.ItemCarrito.id == id).first()
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item de carrito no encontrado"
        )

    try:
        db.delete(db_item)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar item de carrito: {str(e)}"
        )
    
    return None