import { useState, useEffect } from "react";
import axios from "axios";

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  const [nuevaCat, setNuevaCat] = useState({ nombre: "", descripcion: "" });
  const [nuevaSub, setNuevaSub] = useState({
    nombre: "",
    id_categoria: "",
    descripcion: "",
  });

  const [editandoCat, setEditandoCat] = useState(null);
  const [editandoSub, setEditandoSub] = useState(null);

  const token = localStorage.getItem("token");

  // --- Fetch ---
  const fetchCategorias = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/categoria/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  };

  const fetchSubcategorias = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/subcategoria/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubcategorias(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
  }, []);

  // --- Handlers ---
  const handleChangeCat = (e) => {
    setNuevaCat({ ...nuevaCat, [e.target.name]: e.target.value });
  };

  const handleChangeSub = (e) => {
    setNuevaSub({ ...nuevaSub, [e.target.name]: e.target.value });
  };

  const handleSubmitCat = (e) => {
    e.preventDefault();
    const url = editandoCat
      ? `${import.meta.env.VITE_API_URL}/categoria/${editandoCat}`
      : `${import.meta.env.VITE_API_URL}/categoria/`;
    const method = editandoCat ? axios.put : axios.post;

    method(url, nuevaCat, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setNuevaCat({ nombre: "", descripcion: "" });
        setEditandoCat(null);
        fetchCategorias();
      })
      .catch((err) => alert(err.response?.data?.detail || "Error al guardar categoría"));
  };

  const handleSubmitSub = (e) => {
    e.preventDefault();
    const payload = {
      nombre: nuevaSub.nombre,
      descripcion: nuevaSub.descripcion || "",
      id_categoria: parseInt(nuevaSub.id_categoria),
    };
    const url = editandoSub
      ? `${import.meta.env.VITE_API_URL}/subcategoria/${editandoSub}`
      : `${import.meta.env.VITE_API_URL}/subcategoria/`;
    const method = editandoSub ? axios.put : axios.post;

    method(url, payload, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setNuevaSub({ nombre: "", id_categoria: "", descripcion: "" });
        setEditandoSub(null);
        fetchSubcategorias();
      })
      .catch((err) => alert(err.response?.data?.detail || "Error al guardar subcategoría"));
  };

  const handleDeleteCat = (id) => {
    if (!window.confirm("¿Eliminar categoría?")) return;
    axios
      .delete(`${import.meta.env.VITE_API_URL}/categoria/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchCategorias)
      .catch((err) => console.error(err));
  };

  const handleDeleteSub = (id) => {
    if (!window.confirm("¿Eliminar subcategoría?")) return;
    axios
      .delete(`${import.meta.env.VITE_API_URL}/subcategoria/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchSubcategorias)
      .catch((err) => console.error(err));
  };

  const handleEditCat = (cat) => {
    setEditandoCat(cat.id);
    setNuevaCat({ nombre: cat.nombre, descripcion: cat.descripcion || "" });
  };

  const handleEditSub = (sub) => {
    setEditandoSub(sub.id);
    setNuevaSub({
      nombre: sub.nombre,
      id_categoria: sub.id_categoria,
      descripcion: sub.descripcion || "",
    });
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
      {/* CATEGORÍAS */}
      <div className="mb-5">
        <h5 className="text-warning">Categorías</h5>
        <form className="row g-3 mb-4" onSubmit={handleSubmitCat}>
          <div className="col-md-4">
            <input
              type="text"
              name="nombre"
              value={nuevaCat.nombre}
              onChange={handleChangeCat}
              className="form-control"
              placeholder="Nombre de categoría"
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              name="descripcion"
              value={nuevaCat.descripcion}
              onChange={handleChangeCat}
              className="form-control "
              placeholder="Descripción (opcional)"
            />
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button type="submit" className="btn btn-warning fw-bold text-dark flex-fill">
              {editandoCat ? "Actualizar" : "Agregar"}
            </button>
            {editandoCat && (
              <button
                type="button"
                className="btn btn-secondary flex-fill"
                onClick={() => {
                  setEditandoCat(null);
                  setNuevaCat({ nombre: "", descripcion: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-dark table-hover table-bordered border-warning align-middle">
            <thead className="table-warning text-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td className="fw-bold text-warning">{c.nombre}</td>
                  <td>{c.descripcion || "-"}</td>
                  <td>
                    <button
                      className="btn btn-outline-warning btn-sm me-2"
                      onClick={() => handleEditCat(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteCat(c.id)}
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

      {/* SUBCATEGORÍAS */}
      <div>
        <h5 className="text-warning">Subcategorías</h5>
        <form className="row g-3 mb-4" onSubmit={handleSubmitSub}>
          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              value={nuevaSub.nombre}
              onChange={handleChangeSub}
              className="form-control "
              placeholder="Nombre de subcategoría"
              required
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              name="id_categoria"
              value={nuevaSub.id_categoria}
              onChange={handleChangeSub}
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
            <input
              type="text"
              name="descripcion"
              value={nuevaSub.descripcion}
              onChange={handleChangeSub}
              className="form-control"
              placeholder="Descripción (opcional)"
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-warning fw-bold text-dark w-100">
              {editandoSub ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-dark table-hover table-bordered border-warning align-middle">
            <thead className="table-warning text-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
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
                    <td className="fw-bold text-warning">{s.nombre}</td>
                    <td>{s.descripcion || "-"}</td>
                    <td>{categoriaNombre}</td>
                    <td>
                      <button
                        className="btn btn-outline-warning btn-sm me-2"
                        onClick={() => handleEditSub(s)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteSub(s.id)}
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
      </div>
    </div>
  );
}

export default AdminCategorias;
