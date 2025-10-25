import { useState, useEffect } from "react";
import axios from "axios";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // === FETCH PEDIDOS ===
  const fetchPedidos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/pedido/`, axiosConfig);
      setPedidos(response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("No se pudieron cargar los pedidos");
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // === ACTUALIZAR ESTADO ===
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/pedido/${id}`,
        { estado: nuevoEstado },
        axiosConfig
      );
      fetchPedidos();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("No se pudo actualizar el estado del pedido");
    }
  };

  // === CLASE DE ESTADO ===
  const getBadgeClass = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "pendiente":
        return "bg-secondary";
      case "procesando":
        return "bg-info text-dark";
      case "enviado":
        return "bg-primary";
      case "entregado":
        return "bg-success";
      case "cancelado":
        return "bg-danger";
      default:
        return "bg-dark";
    }
  };

  return (
    <div
      className="p-4 rounded"
      style={{
        background: "linear-gradient(180deg, #0b0b0b 0%, #1c1c1c 100%)",
        color: "#fff",
        border: "1px solid #c5a100",
        boxShadow: "0 0 10px rgba(197,161,0,0.3)",
      }}
    >

      {error && (
        <div className="alert alert-danger border border-warning bg-dark text-warning">
          {error}
        </div>
      )}

      <div
        className="card border-0"
        style={{
          background: "#141414",
          boxShadow: "0 0 15px rgba(197,161,0,0.2)",
        }}
      >
        <div className="card-body table-responsive">
          <table className="table table-dark table-hover table-bordered border-warning align-middle">
            <thead className="table-warning text-dark">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Total (€)</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-warning">
                    No hay pedidos disponibles
                  </td>
                </tr>
              ) : (
                pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="fw-bold text-warning">{p.id_usuario}</td>
                    <td>{p.total?.toFixed(2) ?? "—"}</td>
                    <td>
                      <span
                        className={`badge ${getBadgeClass(p.estado)} px-3 py-2 text-uppercase`}
                      >
                        {p.estado ?? "—"}
                      </span>
                    </td>
                    <td>{p.fecha_pedido ? new Date(p.fecha_pedido).toLocaleString() : "—"}</td>
                    <td>{p.direccion_envio || "—"}</td>
                    <td>
                      <select
                        className="form-select form-select-sm bg-dark text-light border-warning"
                        style={{ minWidth: "130px" }}
                        value={p.estado ?? "pendiente"}
                        onChange={(e) => actualizarEstado(p.id, e.target.value)}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="procesando">Procesando</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPedidos;
