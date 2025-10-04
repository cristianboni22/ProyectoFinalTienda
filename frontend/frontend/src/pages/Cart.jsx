// src/pages/Cart.jsx
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Cart({ user }) {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Debes iniciar sesión para ir a pagar");
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.product.precio || 0) * (item.cantidad || 1),
    0
  );

  return (
    <div className="container my-5">
      <h2 className="mb-4">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <div className="alert alert-info">Tu carrito está vacío.</div>
      ) : (
        <>
          <div className="row g-3">
            {cart.map(item => (
              <div key={item.product.id + (item.variant?.id || '')} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  <img
                    src={item.product.imagenes?.[0]?.url_imagen || '/placeholder.png'}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "contain" }}
                    alt={item.product.nombre}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5>{item.product.nombre}</h5>
                      {item.variant && <p className="text-muted mb-1">Talla: {item.variant.talla}, Color: {item.variant.color}</p>}
                      <p className="fw-bold">€{item.product.precio}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        max={item.variant?.stock_individual || item.product.stock}
                        value={item.cantidad}
                        onChange={e => updateQuantity(item.product.id, item.variant?.id, parseInt(e.target.value))}
                        className="form-control"
                        style={{ width: '70px' }}
                      />
                      <span className="fw-bold">€{((item.product.precio || 0) * item.cantidad).toFixed(2)}</span>
                      <button className="btn btn-danger btn-sm ms-auto" onClick={() => removeFromCart(item.product.id, item.variant?.id)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
            <h4>Total: €{total.toFixed(2)}</h4>
            <button className="btn btn-primary mt-2" onClick={handleCheckout}>Ir a pagar</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
