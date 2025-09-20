// src/pages/Home.jsx
function Home() {
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
          {/* Cards de productos de ejemplo */}
          <div className="col-md-4">
            <div className="card">
              <img
                src="https://images.unsplash.com/photo-1606813907291-46c8e75f88bb"
                className="card-img-top"
                alt="Producto"
              />
              <div className="card-body">
                <h5 className="card-title">Zapatillas Pro</h5>
                <p className="card-text">€89.99</p>
                <a href="/productos" className="btn btn-dark">
                  Comprar
                </a>
              </div>
            </div>
          </div>
          {/* Repite con más productos */}
        </div>
      </section>
    </div>
  );
}

export default Home;
