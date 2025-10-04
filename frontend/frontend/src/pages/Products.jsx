import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Agrupar subcategorías por categoría
  const groupCategories = (data) => {
    const grouped = {};
    data.forEach((subcat) => {
      const catId = subcat.id_categoria;
      if (!grouped[catId]) grouped[catId] = { id_categoria: catId, subcategorias: [] };
      grouped[catId].subcategorias.push(subcat);
    });
    return Object.values(grouped);
  };

  // Cargar productos y categorías
  useEffect(() => {
    getCategories().then((data) => setCategories(groupCategories(data)));
    getProducts().then(setProducts);
  }, []);

  // Aplicar filtros
  const applyFilters = (catId, subcatId) => {
    setSelectedCategory(catId || "");
    setSelectedSubcategory(subcatId || "");

    getProducts({
      id_categoria: catId || undefined,
      id_subcategoria: subcatId || undefined,
      precio_min: priceRange.min || undefined,
      precio_max: priceRange.max || undefined,
    }).then(setProducts);
  };

  return (
    <div className="container my-4">
      <div className="row">
        {/* Sidebar filtros */}
        <aside className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Filtrar</h5>

              <ul className="list-group mb-3">
                
                <li
                  className={`list-group-item ${selectedCategory === "" ? "active" : ""}`}
                  onClick={() => applyFilters("", "")}
                  style={{ cursor: "pointer" }}
                >
                  Todas
                </li>
                {categories.map((cat) => (
                  <li key={cat.id_categoria} className="list-group-item">
                    {cat.subcategorias.length > 0 && (
                      <ul className="list-group mt-1">
                        {cat.subcategorias.map((sub) => (
                          <li
                            key={sub.id}
                            className={`list-group-item ps-4 ${
                              selectedSubcategory === sub.id ? "active" : ""
                            }`}
                            onClick={() => applyFilters(cat.id_categoria, sub.id)}
                            style={{ cursor: "pointer" }}
                          >
                            {sub.nombre}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              {/* Filtro por precio */}
              <div>
                <label className="form-label fw-semibold">Precio</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => applyFilters(selectedCategory, selectedSubcategory)}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Listado de productos */}
        <main className="col-md-9">
          <h2 className="mb-4">Catálogo de Productos</h2>
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="col-md-4 mb-4">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p>No hay productos disponibles.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;
