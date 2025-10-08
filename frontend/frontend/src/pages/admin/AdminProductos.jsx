// src/AdminProducto.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminProducto = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    marca: "",
    activo: true,
    id_categoria: 0,
    id_subcategoria: 0,
    variantes: [],
    imagenes: [],
  });

  const token = localStorage.getItem("token");
  const API = "http://localhost:8000/producto/";

  // ---------------------------
  // Fetch productos, categorias y subcategorias
  // ---------------------------
  const fetchProductos = async () => {
    const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
    setProductos(res.data);
  };

  const fetchCategorias = async () => {
    const res = await axios.get("http://localhost:8000/categoria/");
    setCategorias(res.data);
  };

  const fetchSubcategorias = async () => {
    const res = await axios.get("http://localhost:8000/subcategoria/all");
    setSubcategorias(res.data);
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchSubcategorias();
  }, []);

  // ---------------------------
  // Handle input change
  // ---------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ---------------------------
  // Abrir modal para crear o editar
  // ---------------------------
  const openModal = (producto = null) => {
    setEditingProducto(producto);
    if (producto) {
      setFormData({ ...producto });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        marca: "",
        activo: true,
        id_categoria: categorias[0]?.id || 0,
        id_subcategoria: subcategorias[0]?.id || 0,
        variantes: [],
        imagenes: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // ---------------------------
  // Agregar variante
  // ---------------------------
  const addVariante = () => {
    setFormData({
      ...formData,
      variantes: [...formData.variantes, { talla: "", color: "", stock_individual: 0, sku: "" }],
    });
  };

  const handleVarianteChange = (index, e) => {
    const { name, value } = e.target;
    const nuevas = [...formData.variantes];
    nuevas[index][name] = value;
    setFormData({ ...formData, variantes: nuevas });
  };

  const removeVariante = (index) => {
    const nuevas = [...formData.variantes];
    nuevas.splice(index, 1);
    setFormData({ ...formData, variantes: nuevas });
  };

  // ---------------------------
  // Agregar imagen
  // ---------------------------
  const addImagen = (url) => {
    setFormData({
      ...formData,
      imagenes: [...formData.imagenes, { url_imagen: url }],
    });
  };

  const removeImagen = (index) => {
    const nuevas = [...formData.imagenes];
    nuevas.splice(index, 1);
    setFormData({ ...formData, imagenes: nuevas });
  };

  const uploadImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const res = await axios.post(`${API}upload-imagen/`, data);
    addImagen(res.data.url_imagen);
  };

  // ---------------------------
  // Crear o actualizar producto
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProducto) {
        await axios.put(`${API}${editingProducto.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchProductos();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto");
    }
  };

  // ---------------------------
  // Eliminar producto
  // ---------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    await axios.delete(`${API}${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchProductos();
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="container mt-4 text-warning">
      <h3>Administración de Productos</h3>
      <button className="btn btn-primary mb-3" onClick={() => openModal()}>
        Crear Producto
      </button>

      <table className="table table-dark table-hover table-bordered border-warning align-middle">
        <thead className="table-warning text-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Marca</th>
            <th>Activo</th>
            <th>Categoria</th>
            <th>Subcategoria</th>
            <th>Variantes</th>
            <th>Imagenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.marca}</td>
              <td>{p.activo ? "Sí" : "No"}</td>
              <td>{p.id_categoria}</td>
              <td>{p.id_subcategoria}</td>
              <td>
                {p.variantes.map((v, i) => (
                  <div key={i}>
                    {v.talla} {v.color} ({v.stock_individual})
                  </div>
                ))}
              </td>
              <td>
                {p.imagenes.map((img, i) => (
                  <img key={i} src={img.url_imagen} alt="" width="50" className="me-1" />
                ))}
              </td>
              <td>
                <button className="btn btn-outline-warning btn-sm me-2" onClick={() => openModal(p)}>
                  Editar
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
  <div className="modal d-block" tabIndex="-1">
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{editingProducto ? "Editar" : "Crear"} Producto</h5>
          <button type="button" className="btn-close" onClick={closeModal}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-2">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  style={{ '::placeholder': { color: 'gray' } }}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  style={{ '::placeholder': { color: 'gray' } }}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <select
                  className="form-select"
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  required
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔽 SUBCATEGORÍAS FILTRADAS POR CATEGORÍA */}
              <div className="col">
                <select
                  className="form-select"
                  name="id_subcategoria"
                  value={formData.id_subcategoria}
                  onChange={handleChange}
                  required
                >
                  {subcategorias
                    .filter((s) => s.id_categoria === Number(formData.id_categoria))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Activo</label>
                </div>
              </div>
            </div>

            <hr />
            <h6>Variantes</h6>
            {formData.variantes.map((v, i) => (
              <div className="row mb-2" key={i}>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Talla"
                    name="talla"
                    value={v.talla}
                    onChange={(e) => handleVarianteChange(i, e)}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Color"
                    name="color"
                    value={v.color}
                    onChange={(e) => handleVarianteChange(i, e)}
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Stock"
                    name="stock_individual"
                    value={v.stock_individual}
                    onChange={(e) => handleVarianteChange(i, e)}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="SKU"
                    name="sku"
                    value={v.sku}
                    onChange={(e) => handleVarianteChange(i, e)}
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeVariante(i)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary mb-2" onClick={addVariante}>
              Agregar Variante
            </button>

            <hr />
            <h6>Imágenes</h6>
            {formData.imagenes.map((img, i) => (
              <div className="mb-2" key={i}>
                <img src={img.url_imagen} alt="" width="100" className="me-2" />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeImagen(i)}>
                  Eliminar
                </button>
              </div>
            ))}
            <input type="file" onChange={uploadImagen} className="form-control mb-2" />

            <button type="submit" className="btn btn-success">
              Guardar
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={closeModal}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminProducto;
