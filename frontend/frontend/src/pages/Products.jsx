import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Cargar categorías y productos al inicio
  useEffect(() => {
    getCategories().then(setCategories);
    getProducts().then(setProducts);
  }, []);

  // Manejar filtro por categoría
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    getProducts({ id_categoria: categoryId }).then(setProducts);
  };

  // Manejar filtro por precio
  const handlePriceFilter = () => {
    getProducts({
      id_categoria: selectedCategory || undefined,
      precio_min: priceRange.min || undefined,
      precio_max: priceRange.max || undefined,
    }).then(setProducts);
  };

  return (
    <div className="container my-4">
      <div className="row">
        {/* SIDEBAR FILTROS */}
        <aside className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Filtrar</h5>

              {/* Categorías */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Categorías</label>
                <ul className="list-group">
                  <li
                    className={`list-group-item ${
                      selectedCategory === "" ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange("")}
                    style={{ cursor: "pointer" }}
                  >
                    Todas
                  </li>
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className={`list-group-item ${
                        selectedCategory === cat.id ? "active" : ""
                      }`}
                      onClick={() => handleCategoryChange(cat.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {cat.nombre}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filtro precio */}
              <div>
                <label className="form-label fw-semibold">Precio</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                  />
                </div>
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={handlePriceFilter}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* LISTADO PRODUCTOS */}
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
