// src/pages/Cart.jsx
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + (item.product?.precio || 0) * (item.cantidad || 0),
    0
  );

  return (
    <div className="container my-5">
      <h2 className="mb-4">Carrito de Compras</h2>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="list-group">
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.variant?.id || index}`}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{item.product.nombre}</strong>
                {item.variant && (
                  <span className="text-muted">
                    {" "}
                    - Talla: {item.variant.talla}, Color: {item.variant.color}
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={item.variant?.stock_individual || item.product.stock}
                  value={item.cantidad}
                  className="form-control"
                  style={{ width: "70px" }}
                  onChange={(e) =>
                    updateQuantity(
                      item.product.id,
                      item.variant?.id,
                      parseInt(e.target.value)
                    )
                  }
                />
                <span className="fw-bold">
                  ${((item.product?.precio || 0) * (item.cantidad || 0)).toFixed(2)}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    removeFromCart(item.product.id, item.variant?.id)
                  }
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <h4 className="mt-3">Total: ${total.toFixed(2)}</h4>
          <Link to="/checkout" className="btn btn-primary mt-2">
            Ir a pagar
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
