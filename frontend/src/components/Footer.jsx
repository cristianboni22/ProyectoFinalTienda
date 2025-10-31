function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 pt-5 pb-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Logo */}
        <h1 className="fw-bold mb-3 mb-md-0">
          Mi<span className="text-warning">Tienda</span>
        </h1>

        {/* Links */}
        <ul className="list-unstyled d-flex gap-4 mb-3 mb-md-0">
          <li><a href="/" className="text-white text-decoration-none">Inicio</a></li>
          <li><a href="/productos" className="text-white text-decoration-none">Productos</a></li>
          <li><a href="/nosotros" className="text-white text-decoration-none">Nosotros</a></li>
          <li><a href="/contacto" className="text-white text-decoration-none">Contacto</a></li>
        </ul>
      </div>
      <div className="text-center mt-3">
        <small>&copy; 2025 MiTienda - Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}

export default Footer;