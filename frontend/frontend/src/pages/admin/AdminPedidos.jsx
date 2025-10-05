import { useState, useEffect } from "react";
import axios from "axios";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const token = localStorage.getItem("token");

  const fetchPedidos = () => {
    axios
      .get("http://localhost:8000/pedido/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const actualizarEstado = (id, nuevoEstado) => {
    axios
      .put(
        `http://localhost:8000/pedido/${id}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(fetchPedidos);
  };

  return (
    <div>
      <h4 className="mb-3">Gestión de Pedidos</h4>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
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
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.id_usuario}</td>
              <td>{p.total}</td>
              <td>{p.estado}</td>
              <td>{new Date(p.fecha_pedido).toLocaleString()}</td>
              <td>{p.direccion_envio}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={p.estado}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPedidos;
