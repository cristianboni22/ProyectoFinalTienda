// src/pages/ProductDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getProductDetail, getCategories } from "../services/api";
import { FaCartPlus } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    getProductDetail(id).then((data) => {
      setProduct(data);
      if (data?.imagenes?.length > 0) setMainImage(data.imagenes[0].url_imagen);
    });
    getCategories().then(setCategories);
  }, [id]);

  if (!product) return <div className="text-center my-5">Cargando...</div>;

  const handleAddToCart = () => {
    if (!selectedVariant && product.variantes?.length > 0) {
      toast.warning("Por favor selecciona una variante antes de agregar al carrito.");
      return;
    }
    addToCart(product, selectedVariant, cantidad);
    toast.success(`${product.nombre} se ha agregado al carrito!`);
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="row g-5">
        {/* Galería */}
        <div className="col-md-6">
          <div className="border rounded shadow-sm p-3 bg-white d-flex justify-content-center align-items-center">
            <img
              src={mainImage}
              alt={product.nombre}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>

          {product.imagenes?.length > 1 && (
            <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
              {product.imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img.url_imagen}
                  alt={`Vista ${index + 1}`}
                  onClick={() => setMainImage(img.url_imagen)}
                  className={`img-thumbnail ${
                    mainImage === img.url_imagen ? "border border-warning" : ""
                  }`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="fw-bold">{product.nombre}</h2>
          <p className="text-muted">{product.descripcion}</p>
          <h3 className="text-warning fw-bold mb-4">€{product.precio.toFixed(2)}</h3>

          {/* Variantes */}
          {product.variantes?.length > 0 && (
            <div className="mb-4">
              <h6>Opciones disponibles:</h6>
              <ul className="list-group">
                {product.variantes.map((v) => (
                  <li
                    key={v.id}
                    className={`list-group-item ${
                      selectedVariant?.id === v.id ? "active bg-warning text-dark" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedVariant(v)}
                  >
                    Talla: {v.talla}, Color: {v.color}, Stock: {v.stock_individual}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cantidad */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="number"
              min="1"
              max={selectedVariant?.stock_individual || product.stock}
              value={cantidad}
              className="form-control"
              style={{ width: "70px" }}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
            />
            <span className="text-muted">Disponible: {selectedVariant?.stock_individual || product.stock}</span>
          </div>

          {/* Botón agregar al carrito */}
          <button
            className="btn btn-warning btn-lg d-flex align-items-center gap-2 shadow-sm"
            onClick={handleAddToCart}
          >
            <FaCartPlus /> Agregar al carrito
          </button>
        </div>
      </div>

      {/* Tabs de información */}
      <div className="mt-5">
        <ul className="nav nav-tabs" id="productTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active fw-semibold text-dark"
              id="desc-tab"
              data-bs-toggle="tab"
              data-bs-target="#desc"
              type="button"
              role="tab"
            >
              Descripción
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link fw-semibold text-dark"
              id="detalles-tab"
              data-bs-toggle="tab"
              data-bs-target="#detalles"
              type="button"
              role="tab"
            >
              Detalles
            </button>
          </li>
        </ul>
        <div className="tab-content p-3 border border-top-0 rounded-bottom bg-white shadow-sm">
          <div
            className="tab-pane fade show active"
            id="desc"
            role="tabpanel"
            aria-labelledby="desc-tab"
          >
            <p>{product.descripcion || "Sin descripción disponible."}</p>
          </div>
          <div
            className="tab-pane fade"
            id="detalles"
            role="tabpanel"
            aria-labelledby="detalles-tab"
          >
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Nombre:</strong> {product.nombre}</li>
              <li className="list-group-item"><strong>Marca:</strong> {product.marca}</li>
              <li className="list-group-item"><strong>Categoría:</strong> {product.id_categoria}</li>
              <li className="list-group-item"><strong>Stock total:</strong> {product.stock}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
