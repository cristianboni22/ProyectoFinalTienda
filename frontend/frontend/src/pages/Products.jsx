// src/pages/Products.jsx
import { useEffect, useState } from "react";
import { getProducts, getCategories } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const groupCategories = (data) => {
    const grouped = {};
    data.forEach((subcat) => {
      const catId = subcat.id_categoria;
      if (!grouped[catId]) grouped[catId] = { id_categoria: catId, subcategorias: [] };
      grouped[catId].subcategorias.push(subcat);
    });
    return Object.values(grouped);
  };

useEffect(() => {
  getCategories().then((data) => setCategories(groupCategories(data)));
  getProducts().then((data) => {
    const activos = data.filter((p) => p.activo);
    setProducts(activos);
  });
}, []);

const applyFilters = (catId, subcatId) => {
  setSelectedCategory(catId || "");
  setSelectedSubcategory(subcatId || "");

  getProducts().then((data) => {
    let filtered = data.filter((p) => p.activo); // solo activos

    if (catId) filtered = filtered.filter((p) => p.id_categoria === catId);
    if (subcatId) filtered = filtered.filter((p) => p.id_subcategoria === subcatId);
    if (priceRange.min) filtered = filtered.filter((p) => p.precio >= priceRange.min);
    if (priceRange.max) filtered = filtered.filter((p) => p.precio <= priceRange.max);

    setProducts(filtered);
  });
};

  return (
    <div className="container my-5">
      <div className="row">
        {/* Sidebar filtros */}
        <aside className="col-md-3 mb-4">
          <div className="card shadow-lg rounded-4 border-0 position-sticky" style={{ top: "80px" }}>
            <div className="card-body p-4">
              <h5 className="card-title fw-bold text-center mb-4">Filtrar productos</h5>

              {/* Categorías */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Categorías</h6>
                <div className="d-flex flex-column gap-2">
                  <button
                    className={`btn ${selectedCategory === "" ? "btn-warning text-dark" : "btn-outline-secondary"} rounded-pill text-start shadow-sm`}
                    onClick={() => applyFilters("", "")}
                  >
                    Todas las categorías
                  </button>
                  {categories.map((cat) => (
                    <div key={cat.id_categoria}>
                      {cat.subcategorias.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {cat.subcategorias.map((sub) => (
                            <button
                              key={sub.id}
                              className={`btn btn-sm rounded-pill ${selectedSubcategory === sub.id ? "btn-warning text-dark shadow" : "btn-outline-secondary"
                                }`}
                              onClick={() => applyFilters(cat.id_categoria, sub.id)}
                            >
                              {sub.nombre}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por precio */}
              <div className="mb-3">
                <h6 className="fw-semibold mb-2">Precio (€)</h6>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-pill shadow-sm"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-pill shadow-sm"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
                <button
                  className="btn btn-warning w-100 rounded-pill fw-semibold shadow"
                  onClick={() => applyFilters(selectedCategory, selectedSubcategory)}
                >
                  Aplicar filtros
                </button>
              </div>

              {/* Botón limpiar filtros */}
              <button
                className="btn btn-outline-danger w-100 rounded-pill mt-2 shadow-sm"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                  setPriceRange({ min: "", max: "" });
                  applyFilters("", "");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </aside>


        {/* Listado de productos con estilo Home */}
        <main className="col-md-9">
          <h2 className="mb-4 fw-bold">Catálogo de Productos</h2>
          <div className="row g-4">
            {products.length > 0 ? (
              products.map((p) => (
                <div key={p.id} className="col-md-4 d-flex">
                  <div className="card h-100 shadow-sm border-0">
                    {p.imagenes?.length > 0 ? (
                      <img
                        src={p.imagenes[0].url_imagen}
                        className="card-img-top"
                        alt={p.nombre}
                        style={{ height: "200px", objectFit: "contain" }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{ height: "200px" }}
                      >
                        <span className="text-muted">Sin imagen</span>
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.nombre}</h5>
                      <p className="card-text text-success fw-bold">€{p.precio}</p>
                      <a href={`/producto/${p.id}`} className="btn btn-dark mt-auto">
                        Ver detalles
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No hay productos disponibles.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;
