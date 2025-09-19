function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero d-flex align-items-center text-white">
        <div className="container text-center">
          <h1 className="display-3 fw-bold">Nueva Colección 2025</h1>
          <p className="lead">Descubre lo último en estilo y rendimiento.</p>
          <a href="/productos" className="btn btn-primary btn-lg mt-3">
            Comprar Ahora
          </a>
        </div>
      </section>

      {/* Sección de destacados */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4">Productos Destacados</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <img
                src="https://source.unsplash.com/400x400/?shoes"
                className="card-img-top"
                alt="Producto"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Zapatillas Running</h5>
                <p className="card-text">€89.99</p>
                <a href="/productos" className="btn btn-outline-primary">
                  Ver más
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <img
                src="https://source.unsplash.com/400x400/?sportswear"
                className="card-img-top"
                alt="Producto"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Sudadera Deportiva</h5>
                <p className="card-text">€49.99</p>
                <a href="/productos" className="btn btn-outline-primary">
                  Ver más
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <img
                src="https://source.unsplash.com/400x400/?fitness"
                className="card-img-top"
                alt="Producto"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Ropa Training</h5>
                <p className="card-text">€39.99</p>
                <a href="/productos" className="btn btn-outline-primary">
                  Ver más
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
