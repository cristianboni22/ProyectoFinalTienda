// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getProductos } from "../services/productos";

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos({ limit: 3 }); // traemos solo 3 destacados
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
          height: "90vh",
          backgroundImage: "url('/src/assets/banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container text-center">
          <h1 className="display-3 fw-bold">Bienvenido a MiTienda</h1>
          <p className="lead">La mejor ropa y calzado deportivo</p>
          <a href="/productos" className="btn btn-primary btn-lg mt-3">
            Ver productos
          </a>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Productos destacados</h2>
        <div className="row">
          {productos.length === 0 ? (
            <p className="text-center text-muted">No hay productos disponibles</p>
          ) : (
            productos.map((p) => (
              <div key={p.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
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
                  <div className="card-body">
                    <h5 className="card-title">{p.nombre}</h5>
                    <p className="card-text">€{p.precio}</p>
                    <a href={`/producto/${p.id}`} className="btn btn-dark">
                      Comprar
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
