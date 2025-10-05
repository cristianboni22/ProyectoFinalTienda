import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    rol: "usuario",
  });
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUsuarios = () => {
    axios
      .get("http://localhost:8000/usuario/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editando
      ? `http://localhost:8000/usuario/${editando}`
      : "http://localhost:8000/usuario/";
    const method = editando ? axios.put : axios.post;

    method(url, nuevo, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        fetchUsuarios();
        setNuevo({ nombre: "", email: "", rol: "usuario" });
        setEditando(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    axios
      .delete(`http://localhost:8000/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchUsuarios);
  };

  const handleEdit = (u) => {
    setEditando(u.id);
    setNuevo({ nombre: u.nombre, email: u.email, rol: u.rol });
  };

  return (
    <div>
      <h4 className="mb-3">Gestión de Usuarios</h4>

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="text"
            name="nombre"
            value={nuevo.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="email"
            name="email"
            value={nuevo.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Correo"
            required
          />
        </div>
        <div className="col-md-3">
          <select
            name="rol"
            value={nuevo.rol}
            onChange={handleChange}
            className="form-select"
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-success">
            {editando ? "Actualizar" : "Agregar"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditando(null);
                setNuevo({ nombre: "", email: "", rol: "usuario" });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(u)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
