// src/pages/Nosotros.jsx
function Nosotros() {
  return (
    <div className="container my-5">
      {/* Encabezado */}
      <section className="text-center mb-5">
        <h1 className="display-4 fw-bold">Quiénes somos</h1>
        <p className="lead text-muted">
          Moda con estilo, compromiso y autenticidad desde 2015
        </p>
      </section>

      {/* Historia */}
      <section className="mb-5">
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
      </section>

      {/* Qué ofrecemos */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3">Qué ofrecemos</h2>
        <ul className="list-unstyled">
          <li>👕 Moda urbana y deportiva para el día a día</li>
          <li>🌱 Prendas sostenibles hechas con materiales responsables</li>
          <li>✨ Diseños exclusivos que combinan comodidad y tendencia</li>
          <li>👜 Gran variedad: ropa, calzado y accesorios</li>
        </ul>
      </section>

      {/* Compromiso */}
      <section className="mb-5 bg-light p-4 rounded shadow-sm">
        <h2 className="fw-bold mb-3">Nuestro compromiso</h2>
        <p>
          Creemos que la moda también puede ser responsable. 
          Por eso trabajamos con proveedores que respetan procesos sostenibles, 
          reducimos plásticos en nuestros envíos y fomentamos el reciclaje de prendas.
        </p>
      </section>

      {/* Misión */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3">Nuestra misión</h2>
        <blockquote className="blockquote">
          “Queremos que cada persona se sienta <strong>auténtica y segura</strong> al vestir nuestras prendas. 
          No vendemos solo ropa, vendemos estilo, confianza y comodidad.”
        </blockquote>
      </section>

      {/* Equipo */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3">Nuestro equipo</h2>
        <p>
          Detrás de <strong>MiTienda</strong> hay un equipo apasionado por la moda y la innovación. 
          Desde diseñadores hasta asesores de tienda, todos trabajamos con la misma ilusión: 
          ayudarte a encontrar tu estilo.
        </p>
      </section>

      {/* Dónde estamos */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3">Dónde estamos</h2>
        <p>
          📍 Tienda física en <strong>Madrid, España</strong>  
          <br />
          🚚 Envíos a toda España y próximamente a Europa.
        </p>
      </section>

      {/* Contacto */}
      <section className="text-center">
        <h2 className="fw-bold mb-3">Contáctanos</h2>
        <p>
          <strong>Email:</strong> contacto@mitienda.com <br />
          <strong>Teléfono:</strong> +34 600 000 000
        </p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <a href="#" className="text-dark fs-4">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="text-dark fs-4">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" className="text-dark fs-4">
            <i className="bi bi-twitter"></i>
          </a>
        </div>
      </section>
    </div>
  );
}

export default Nosotros;
