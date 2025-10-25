// src/pages/OrderConfirmation.jsx
import { useParams, Link } from "react-router-dom";

function OrderConfirmation() {
  const { orderId } = useParams();
  const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));

  return (
    <div className="container my-5 text-center">
      <h2>🎉 ¡Pedido Confirmado!</h2>
      <p>Tu número de pedido es <strong>{orderId}</strong>.</p>
      {lastOrder && (
        <div className="mt-3">
          <h5>Resumen:</h5>
          <ul className="list-group">
            {lastOrder.items.map((item, i) => (
              <li key={i} className="list-group-item">
                {item.product.nombre} x {item.cantidad} = €
                {(item.product.precio * item.cantidad).toFixed(2)}
              </li>
            ))}
          </ul>
          <h4 className="mt-3">Total: €{lastOrder.total.toFixed(2)}</h4>
        </div>
      )}
      <Link to="/" className="btn btn-primary mt-4">
        Seguir Comprando
      </Link>
    </div>
  );
}

export default OrderConfirmation;
