import { useEffect, useState } from "react";
import axios from "axios";

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    id_categoria: "",
    id_subcategoria: "",
  });
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem("token");

  // ---------------- FETCH ----------------
  const fetchProductos = () => {
    axios
      .get("http://localhost:8000/producto/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProductos(res.data))
      .catch((err) => console.error(err));
  };

  const fetchCategorias = () => {
    axios
      .get("http://localhost:8000/categoria/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  };

  const fetchTodasSubcategorias = () => {
    axios
      .get("http://localhost:8000/subcategoria/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubcategorias(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchTodasSubcategorias();
  }, []);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
    // Reset subcategoría si cambia categoría
    if (e.target.name === "id_categoria") {
      setNuevoProducto((prev) => ({ ...prev, id_subcategoria: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      axios
        .put(
          `http://localhost:8000/producto/${editando}`,
          nuevoProducto,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          setEditando(null);
          setNuevoProducto({ nombre: "", descripcion: "", precio: 0, id_categoria: "", id_subcategoria: "" });
          fetchProductos();
        });
    } else {
      axios
        .post("http://localhost:8000/producto/", nuevoProducto, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setNuevoProducto({ nombre: "", descripcion: "", precio: 0, id_categoria: "", id_subcategoria: "" });
          fetchProductos();
        });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    axios
      .delete(`http://localhost:8000/producto/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchProductos);
  };

  const handleEdit = (producto) => {
    setEditando(producto.id);
    setNuevoProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      id_categoria: producto.id_categoria || "",
      id_subcategoria: producto.id_subcategoria || "",
    });
  };

  // ---------------- FILTROS SUBCATEGORÍA ----------------
  const subcategoriasFiltradas = subcategorias.filter(
    (s) => s.id_categoria === Number(nuevoProducto.id_categoria)
  );

  const getCategoriaNombre = (id) => categorias.find((c) => c.id === id)?.nombre || "-";
  const getSubcategoriaNombre = (id) => subcategorias.find((s) => s.id === id)?.nombre || "-";

  // ---------------- RENDER ----------------
  return (
    <div>
      <h4 className="mb-3">Gestión de Productos</h4>

      {/* Formulario */}
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="text"
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="descripcion"
            value={nuevoProducto.descripcion}
            onChange={handleChange}
            className="form-control"
            placeholder="Descripción"
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="precio"
            value={nuevoProducto.precio}
            onChange={handleChange}
            className="form-control"
            placeholder="Precio (€)"
            min="0"
            required
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="id_categoria"
            value={nuevoProducto.id_categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="id_subcategoria"
            value={nuevoProducto.id_subcategoria}
            onChange={handleChange}
            required
            disabled={!nuevoProducto.id_categoria}
          >
            <option value="">Seleccionar Subcategoría</option>
            {subcategoriasFiltradas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-success">
            {editando ? "Guardar cambios" : "Agregar producto"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditando(null);
                setNuevoProducto({ nombre: "", descripcion: "", precio: 0, id_categoria: "", id_subcategoria: "" });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de productos */}
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.precio} €</td>
              <td>{getCategoriaNombre(p.id_categoria)}</td>
              <td>{getSubcategoriaNombre(p.id_subcategoria)}</td>
              <td>{p.activo ? "✅" : "❌"}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductos;
