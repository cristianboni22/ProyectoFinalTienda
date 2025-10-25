function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="d-flex align-items-center mb-3">
      <img src={item.imagen} alt={item.nombre} width={60} className="me-3" />
      <div className="flex-grow-1">
        <h6>{item.nombre}</h6>
        <div>
          <input
            type="number"
            min="1"
            value={item.cantidad}
            onChange={e => onUpdateQuantity(item.id, Number(e.target.value))}
            className="form-control d-inline-block w-auto me-2"
          />
          <span>${item.precio * item.cantidad}</span>
        </div>
      </div>
      <button className="btn btn-danger ms-3" onClick={onRemove}>Eliminar</button>
    </div>
  );
}

export default CartItem;