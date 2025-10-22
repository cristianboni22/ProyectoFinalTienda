// src/pages/Checkout.jsx
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [userData, setUserData] = useState({});
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://mitiendaproyecto.zapto.org:8000/usuario/me", { headers })
      .then((res) => {
        setUserData(res.data);
        setDireccion(res.data.direccion || "");
      })
      .catch((err) => {
        console.error(err);
        toast.error("No se pudo cargar datos del usuario");
      });
  }, []);

  const total = cart.reduce(
    (acc, i) => acc + (i.product.precio || 0) * i.cantidad,
    0
  );

  const handleConfirm = async () => {
    if (!direccion.trim()) {
      toast.error("Debes poner una dirección de envío");
      return;
    }

    setLoading(true);

    try {
      // Crear pedido
      const pedidoRes = await axios.post(
        "http://mitiendaproyecto.zapto.org:8000/pedido/",
        {
          direccion_envio: direccion.trim(),
          total: parseFloat(total.toFixed(2)),
          estado: "pendiente",
        },
        { headers }
      );

      const id_pedido = pedidoRes.data.id;

      // Crear detalles de pedido
      for (const item of cart) {
        await axios.post(
          "http://mitiendaproyecto.zapto.org:8000/detalle_pedido/",
          {
            id_pedido,
            id_producto: item.product.id,
            id_variante: item.variant?.id || null,
            cantidad: item.cantidad,
            precio_unitario: item.product.precio,
          },
          { headers }
        );
      }

      clearCart();
      toast.success("Pedido realizado con éxito");
      navigate("/perfil");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(
        err.response?.data?.detail?.[0]?.msg || "Error al procesar el pedido"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Checkout</h2>

      <div className="card p-4 shadow-sm rounded-4">
        <h4>Datos de Envío</h4>

        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={`${userData.nombre || ""} ${userData.apellido || ""}`}
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={userData.email || ""} disabled />
        </div>

        <div className="mb-3">
          <label>Teléfono</label>
          <input type="text" className="form-control" value={userData.telefono || ""} disabled />
        </div>

        <div className="mb-3">
          <label>Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <h4>Resumen del Pedido</h4>
        <ul className="list-group mb-3">
          {cart.map((i) => (
            <li
              key={i.product.id + (i.variant?.id || "")}
              className="list-group-item d-flex justify-content-between"
            >
              {i.product.nombre} {i.variant ? `(${i.variant.talla}, ${i.variant.color})` : ""}
              <span>€{(i.product.precio * i.cantidad).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <h4>Total: €{total.toFixed(2)}</h4>

        <button
          className="btn btn-success w-100 mt-3"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Confirmar Pedido"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
