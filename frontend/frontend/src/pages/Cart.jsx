// src/pages/Cart.jsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Cart({ user }) {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Debes iniciar sesión para ir a pagar");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.product.precio || 0) * (item.cantidad || 1),
    0
  );

  return (
    <div className="container my-5">
      <h2 className="mb-5 text-center fw-bold">Carrito de Compras</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info text-center fs-5">Tu carrito está vacío.</div>
      ) : (
        <div className="row g-4">
          {/* Productos */}
          <div className="col-lg-8">
            <div className="row g-4">
              {cart.map((item) => {
                const stock = item.variant?.stock_individual ?? item.product.stock;
                return (
                  <div
                    key={item.product.id + (item.variant?.id || "")}
                    className="col-md-6"
                  >
                    <div className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden position-relative hover-shadow">
                      <div className="position-relative">
                        <img
                          src={item.product.imagenes?.[0]?.url_imagen || "/placeholder.png"}
                          className="card-img-top"
                          alt={item.product.nombre}
                          style={{
                            height: "220px",
                            objectFit: "contain",
                            background: "#f8f9fa",
                            transition: "transform 0.3s",
                          }}
                        />
                        <span
                          className={`badge position-absolute top-0 start-0 m-2 ${
                            stock > 0 ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {stock > 0 ? "Disponible" : "Agotado"}
                        </span>
                        {item.variant && (
                          <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                            {item.variant.color} / {item.variant.talla}
                          </span>
                        )}
                      </div>
                      <div className="card-body d-flex flex-column justify-content-between">
                        <div>
                          <h5 className="card-title">{item.product.nombre}</h5>
                          <p className="text-success fw-bold mb-2">€{item.product.precio}</p>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                          <input
                            type="number"
                            min="1"
                            max={stock}
                            value={item.cantidad}
                            onChange={(e) =>
                              updateQuantity(
                                item.product.id,
                                item.variant?.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="form-control"
                            style={{ width: "70px" }}
                          />
                          <span className="fw-bold fs-6">
                            Total: €{((item.product.precio || 0) * item.cantidad).toFixed(2)}
                          </span>
                          <button
                            className="btn btn-outline-danger btn-sm ms-auto"
                            onClick={() =>
                              removeFromCart(item.product.id, item.variant?.id)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen Sticky */}
          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: "20px" }}>
              <div className="card shadow-lg rounded-4 p-4 border-0">
                <h4 className="fw-bold mb-3">Resumen del Pedido</h4>
                <ul className="list-group list-group-flush mb-3">
                  {cart.map((item) => (
                    <li
                      key={item.product.id + (item.variant?.id || "")}
                      className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                    >
                      <span>{item.product.nombre}</span>
                      <span>€{((item.product.precio || 0) * item.cantidad).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong>Total:</strong>
                  <strong>€{total.toFixed(2)}</strong>
                </div>
                <button
                  className="btn btn-primary w-100 btn-lg"
                  onClick={handleCheckout}
                >
                  Ir a pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
