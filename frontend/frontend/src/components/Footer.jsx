function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 pt-4 pb-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Logo */}
        <h4 className="fw-bold mb-3 mb-md-0">
          Mi<span className="text-primary">Tienda</span>
        </h4>

        {/* Links */}
        <ul className="list-unstyled d-flex gap-4 mb-3 mb-md-0">
          <li><a href="/" className="text-white text-decoration-none">Inicio</a></li>
          <li><a href="/productos" className="text-white text-decoration-none">Productos</a></li>
          <li><a href="/about" className="text-white text-decoration-none">Nosotros</a></li>
          <li><a href="/contacto" className="text-white text-decoration-none">Contacto</a></li>
        </ul>

        {/* Redes sociales */}
        <div className="d-flex gap-3">
          <a href="#" className="text-white fs-5"><i className="bi bi-facebook"></i></a>
          <a href="#" className="text-white fs-5"><i className="bi bi-instagram"></i></a>
          <a href="#" className="text-white fs-5"><i className="bi bi-twitter"></i></a>
        </div>
      </div>
      <div className="text-center mt-3">
        <small>&copy; 2025 MiTienda - Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}

export default Footer;
