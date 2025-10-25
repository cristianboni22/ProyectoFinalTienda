// src/AdminUsuarios.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    direccion: "",
    telefono: "",
    rol: "cliente",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // JWT del login
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuario/`, axiosConfig);
      setUsuarios(response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.contrasena && !formData.id) {
      setError("La contraseña es obligatoria al crear un usuario");
      return;
    }

    try {
      if (formData.id) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/usuario/${formData.id}`,
          formData,
          axiosConfig
        );
        setUsuarios(usuarios.map((u) => (u.id === formData.id ? response.data : u)));
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/usuario/`,
          formData,
          axiosConfig
        );
        setUsuarios(response.data);
      }

      setFormData({
        id: null,
        nombre: "",
        apellido: "",
        email: "",
        contrasena: "",
        direccion: "",
        telefono: "",
        rol: "cliente",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Error al guardar usuario: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      contrasena: "",
      direccion: user.direccion,
      telefono: user.telefono,
      rol: user.rol,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/usuario/${id}`, axiosConfig);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("No se pudo eliminar el usuario");
    }
  };

  return (
    <div className="container-fluid mt-5">
      <h1 className="text-warning mb-4">Administración de Usuarios</h1>

      {/* Formulario */}
      <div className="card mb-4 shadow-sm bg-dark text-white">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                className="form-control "
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-control "
              />
            </div>
            <div className="col-md-6">
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="form-select "
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button type="submit" className="btn btn-warning w-100">
                {formData.id ? "Editar Usuario" : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm bg-dark text-white">
        <div className="card-body table-responsive">
          <table className="table table-dark table-hover table-bordered border-warning align-middle">
            <thead className="table-warning text-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.email}</td>
                  <td>{user.direccion}</td>
                  <td>{user.telefono}</td>
                  <td>{user.rol}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-outline-warning btn-sm me-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-outline-danger btn-sm me-2"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;
