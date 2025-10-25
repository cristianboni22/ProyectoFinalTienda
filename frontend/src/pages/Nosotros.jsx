// src/pages/Nosotros.jsx
function Nosotros() {
  return (
    <div className="container my-5">

      {/* Encabezado Hero */}
      <section className="text-center mb-5 py-5 bg-dark text-white rounded shadow-sm" style={{backgroundImage: "url('/src/assets/banner.png')", backgroundSize: "cover", backgroundPosition: "center"}}>
        <h1 className="display-4 fw-bold">Quiénes somos</h1>
        <p className="lead">Moda con estilo, compromiso y autenticidad desde 2015</p>
      </section>

      {/* Historia */}
      <section className="mb-5">
        <div className="row align-items-center">
          <div className="col-md-12 text-center">
            <h2 className="fw-bold mb-3">Nuestra historia</h2>
            <p>
              <strong>MiTienda</strong> nació en 2015 con un objetivo muy claro:
              ofrecer ropa moderna, cómoda y de calidad, al alcance de todos. 
              Todo empezó en un pequeño local familiar en Madrid, donde cada prenda
              era seleccionada cuidadosamente pensando en el estilo y la personalidad
              de nuestros clientes.
            </p>
            <p>
              Con el paso de los años, hemos crecido gracias a la confianza de
              quienes nos eligen cada día.
            </p>
          </div>
        </div>
      </section>

      {/* Qué ofrecemos */}
      <section className="mb-5">
        <h2 className="fw-bold mb-4 text-center">Qué ofrecemos</h2>
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm h-100 border-0">
              <div className="card-body">
                <div className="fs-1 mb-2">👕</div>
                <h5 className="card-title fw-bold">Moda urbana y deportiva</h5>
                <p className="card-text text-muted">Ropa cómoda y moderna para el día a día.</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm h-100 border-0">
              <div className="card-body">
                <div className="fs-1 mb-2">🌱</div>
                <h5 className="card-title fw-bold">Sostenibilidad</h5>
                <p className="card-text text-muted">Prendas hechas con materiales responsables.</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm h-100 border-0">
              <div className="card-body">
                <div className="fs-1 mb-2">✨</div>
                <h5 className="card-title fw-bold">Diseños exclusivos</h5>
                <p className="card-text text-muted">Comodidad y tendencia en cada prenda.</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm h-100 border-0">
              <div className="card-body">
                <div className="fs-1 mb-2">👜</div>
                <h5 className="card-title fw-bold">Gran variedad</h5>
                <p className="card-text text-muted">Ropa, calzado y accesorios para todos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compromiso */}
      <section className="mb-5 p-5 bg-light rounded shadow-sm text-center">
        <h2 className="fw-bold mb-3">Nuestro compromiso</h2>
        <p className="lead">
          Creemos que la moda también puede ser responsable. Trabajamos con proveedores que respetan procesos sostenibles,
          reducimos plásticos en nuestros envíos y fomentamos el reciclaje de prendas.
        </p>
      </section>

      {/* Misión */}
      <section className="mb-5 text-center">
        <h2 className="fw-bold mb-3">Nuestra misión</h2>
        <blockquote className="blockquote fs-5">
          “Queremos que cada persona se sienta <strong>auténtica y segura</strong> al vestir nuestras prendas. 
          No vendemos solo ropa, vendemos estilo, confianza y comodidad.”
        </blockquote>
      </section>

      {/* Equipo */}
      <section className="mb-5">
        <h2 className="fw-bold mb-4 text-center">Nuestro equipo</h2>
        <div className="row g-4 justify-content-center">
          <div className="col-md-3 text-center">
            <h5 className="fw-bold">Ana López</h5>
            <p className="text-muted">Diseñadora jefe</p>
          </div>
          <div className="col-md-3 text-center">
            <h5 className="fw-bold">Carlos Pérez</h5>
            <p className="text-muted">Responsable de tienda</p>
          </div>
          <div className="col-md-3 text-center">
            <h5 className="fw-bold">Lucía Gómez</h5>
            <p className="text-muted">Marketing y comunicación</p>
          </div>
        </div>
      </section>

      {/* Dónde estamos */}
      <section className="mb-5 text-center">
        <h2 className="fw-bold mb-3">Dónde estamos</h2>
        <p className="fs-5">
          📍 Tienda física en <strong>Madrid, España</strong> <br />
          🚚 Envíos a toda España y próximamente a Europa.
        </p>
      </section>

      {/* Contacto */}
      <section className="text-center mb-5">
        <h2 className="fw-bold mb-3">Contáctanos</h2>
        <p className="fs-5">
          <strong>Email:</strong> contacto@mitienda.com <br />
          <strong>Teléfono:</strong> +34 600 000 000
        </p>
        <div className="d-flex justify-content-center gap-4 mt-3 fs-4">
          <a href="#" className="text-dark"><i className="bi bi-facebook"></i></a>
          <a href="#" className="text-dark"><i className="bi bi-instagram"></i></a>
          <a href="#" className="text-dark"><i className="bi bi-twitter"></i></a>
        </div>
      </section>

    </div>
  );
}

export default Nosotros;
