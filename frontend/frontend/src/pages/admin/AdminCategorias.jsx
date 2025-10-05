import { useState, useEffect } from "react";
import axios from "axios";

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [nuevaSub, setNuevaSub] = useState({ nombre: "", id_categoria: "" });
  const [editandoSub, setEditandoSub] = useState(null);
  const token = localStorage.getItem("token");

  // ------------------- FETCH -------------------
  const fetchCategorias = () => {
    axios
      .get("http://localhost:8000/categoria/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  };

  const fetchSubcategorias = () => {
    axios
      .get("http://localhost:8000/subcategoria/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubcategorias(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
  }, []);

  // ------------------- HANDLERS -------------------
  const handleChange = (e) => {
    setNuevaSub({ ...nuevaSub, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editandoSub
      ? `http://localhost:8000/subcategoria/${editandoSub}`
      : "http://localhost:8000/subcategoria/";
    const method = editandoSub ? axios.put : axios.post;

    method(url, nuevaSub, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setNuevaSub({ nombre: "", id_categoria: "" });
        setEditandoSub(null);
        fetchSubcategorias();
      })
      .catch((err) => {
        console.error(err);
        alert(
          err.response?.data?.detail || "Error al guardar la subcategoría"
        );
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar subcategoría?")) return;

    axios
      .delete(`http://localhost:8000/subcategoria/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchSubcategorias)
      .catch((err) => console.error(err));
  };

  const handleEdit = (sub) => {
    setEditandoSub(sub.id);
    setNuevaSub({
      nombre: sub.nombre,
      id_categoria: sub.id_categoria,
    });
  };

  // ------------------- RENDER -------------------
  return (
    <div>
      <h4 className="mb-3">Gestión de Subcategorías</h4>

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-5">
          <input
            type="text"
            name="nombre"
            value={nuevaSub.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre de subcategoría"
            required
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            name="id_categoria"
            value={nuevaSub.id_categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-success">
            {editandoSub ? "Actualizar" : "Agregar"}
          </button>
          {editandoSub && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditandoSub(null);
                setNuevaSub({ nombre: "", id_categoria: "" });
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
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subcategorias.map((s) => {
            const categoriaNombre =
              categorias.find((c) => c.id === s.id_categoria)?.nombre || "-";
            return (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nombre}</td>
                <td>{categoriaNombre}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(s)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategorias;
