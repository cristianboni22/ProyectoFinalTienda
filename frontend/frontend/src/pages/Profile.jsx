// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaHome, FaCalendarAlt } from "react-icons/fa";

function Profile() {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token, inicia sesión primero");
      return;
    }

    const fetchUsuario = fetch("http://mitiendaproyecto.zapto.org:8000/usuario/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) =>
      res.ok ? res.json() : Promise.reject("No se pudo obtener el usuario")
    );

    const fetchPedidos = fetch("http://mitiendaproyecto.zapto.org:8000/pedido/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) =>
      res.ok ? res.json() : Promise.reject("No se pudieron cargar los pedidos")
    );

    const fetchProductos = fetch("http://mitiendaproyecto.zapto.org:8000/producto/").then((res) =>
      res.ok ? res.json() : Promise.reject("No se pudieron cargar los productos")
    );

    Promise.all([fetchUsuario, fetchPedidos, fetchProductos])
      .then(async ([usuarioData, pedidosData, productosData]) => {
        setUsuario(usuarioData);
        setProductos(productosData);

        const pedidosConDetalles = await Promise.all(
          pedidosData.map(async (pedido) => {
            const detallesRes = await fetch(
              `http://mitiendaproyecto.zapto.org:8000/detalle_pedido/pedido/${pedido.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const detalles = detallesRes.ok ? await detallesRes.json() : [];

            const detallesConProductos = detalles.map((detalle) => {
              const producto = productosData.find(
                (p) => p.id === detalle.id_producto
              );

              const variante = producto?.variantes.find(
                (v) =>
                  (v.talla === detalle.talla || !detalle.talla) &&
                  (v.color === detalle.color || !detalle.color)
              );

              return { ...detalle, producto, variante };
            });

            return { ...pedido, detalles: detallesConProductos };
          })
        );

        setPedidos(pedidosConDetalles);
      })
      .catch((err) => setError(err));
  }, []);

  if (error)
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  if (!usuario) return <div className="text-center mt-5">Cargando usuario...</div>;

  const estadoColor = (estado) => {
    switch (estado) {
      case "pendiente": return "warning";
      case "procesando": return "info";
      case "enviado": return "primary";
      case "entregado": return "success";
      case "cancelado": return "danger";
      default: return "secondary";
    }
  };

  const calcularTotal = (pedido) => {
    return pedido.detalles.reduce((acc, detalle) => {
      const precio = detalle.producto?.precio || 0;
      const cantidad = detalle.cantidad || 1;
      return acc + precio * cantidad;
    }, 0);
  };

  return (
    <div className="container my-5">
      {/* Info usuario */}
      <div className="card mb-5 shadow-sm border-0 rounded-4">
        <div className="card-header bg-dark text-white rounded-top-4 d-flex align-items-center gap-2">
          <FaUser /> <h4 className="mb-0">Perfil de Usuario</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <p><FaUser className="me-2 text-primary"/> <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
              <p><FaEnvelope className="me-2 text-primary"/> <strong>Email:</strong> {usuario.email}</p>
              <p><FaPhone className="me-2 text-primary"/> <strong>Teléfono:</strong> {usuario.telefono || "No especificado"}</p>
            </div>
            <div className="col-md-6">
              <p><FaHome className="me-2 text-primary"/> <strong>Dirección:</strong> {usuario.direccion || "No especificada"}</p>
              <p><FaCalendarAlt className="me-2 text-primary"/> <strong>Registrado:</strong> {new Date(usuario.fecha_registro).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos */}
      <h3 className="mb-3">Mis Pedidos</h3>
      {pedidos.length === 0 ? (
        <div className="alert alert-info">No has realizado pedidos todavía.</div>
      ) : (
        <div className="accordion" id="pedidosAccordion">
          {pedidos.map((pedido, idx) => (
            <div key={pedido.id} className="accordion-item mb-3 border-0 shadow-sm rounded-4">
              <h2 className="accordion-header" id={`heading${pedido.id}`}>
                <button
                  className={`accordion-button ${idx !== 0 ? "collapsed" : ""} rounded-4 bg-light`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${pedido.id}`}
                  aria-expanded={idx === 0 ? "true" : "false"}
                  aria-controls={`collapse${pedido.id}`}
                >
                  Pedido - 
                  <span className={`badge bg-${estadoColor(pedido.estado)} ms-2 text-capitalize`}>
                    {pedido.estado}
                  </span> - Total: 💲{calcularTotal(pedido).toFixed(2)}
                </button>
              </h2>
              <div
                id={`collapse${pedido.id}`}
                className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                aria-labelledby={`heading${pedido.id}`}
                data-bs-parent="#pedidosAccordion"
              >
                <div className="accordion-body bg-white rounded-3">
                  <p><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleString()}</p>
                  <p><strong>Dirección de envío:</strong> {pedido.direccion_envio}</p>

                  <div className="table-responsive">
                    <table className="table table-sm table-hover mt-3 rounded-3 shadow-sm align-middle">
                      <thead className="table-light rounded-3">
                        <tr>
                          <th>Producto</th>
                          <th>Talla</th>
                          <th>Color</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.detalles.map((detalle) => (
                          <tr key={detalle.id}>
                            <td className="d-flex align-items-center gap-2">
                              <img
                                src={detalle.producto?.imagenes?.[0]?.url_imagen || '/placeholder.png'}
                                alt={detalle.producto?.nombre}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.5rem' }}
                              />
                              {detalle.producto?.nombre || "Producto no disponible"}
                            </td>
                            <td>{detalle.variante?.talla || "-"}</td>
                            <td>{detalle.variante?.color || "-"}</td>
                            <td>{detalle.cantidad || "-"}</td>
                            <td>💲{detalle.producto?.precio || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
