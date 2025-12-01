// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getProductos } from "../services/productos";
import { Link } from "react-router-dom";

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos({ limit: 3, activo: true });
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="hero d-flex align-items-center text-white"
        style={{
          height: "50vh",
          backgroundColor: "#3498db", // color que quieras
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container text-center">
          <h1 className="display-3 fw-bold">Bienvenido a MiTienda</h1>
          <p className="lead">La mejor ropa y calzado deportivo</p>
          <Link to="/productos" className="btn btn-primary btn-lg mt-3">
            Ver productos
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Productos destacados</h2>
        <div className="row g-4">
          {productos.length === 0 ? (
            <p className="text-center text-muted">
              No hay productos disponibles
            </p>
          ) : (
            productos.map((p) => (
              <div key={p.id} className="col-md-4">
                <Link
                  to={`/producto/${p.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden hover-scale">
                    {p.imagenes?.length > 0 ? (
                      <img
                        src={p.imagenes[0].url_imagen}
                        className="card-img-top"
                        alt={p.nombre}
                        style={{ height: "220px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{ height: "220px" }}
                      >
                        <span className="text-muted">Sin imagen</span>
                      </div>
                    )}
                    <div className="card-body text-center">
                      <h1 className="card-title fw-bold">{p.nombre}</h1>
                      <p className="card-text fs-5 text-primary fw-semibold">
                        €{p.precio.toFixed(2)}
                      </p>
                      <div className="d-grid mt-3">
                        <button className="btn btn-outline-primary">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Estilos extra para hover */}
      <style>{`
        .hover-scale:hover {
          transform: scale(1.03);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default Home;
