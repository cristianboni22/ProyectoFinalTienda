import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm py-3">
        <div className="container">
          {/* LOGO */}
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Mi<span className="text-primary">Tienda</span>
          </Link>

          {/* TOGGLER MOBILE */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* LINKS */}
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto align-items-lg-center gap-3">
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/productos">Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/about">Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light px-3 py-2" to="/carrito">
                  🛒 Carrito
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary px-3 py-2" to="/login">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 🔑 Este div reserva espacio igual a la altura del navbar */}
      <div style={{ height: "80px" }}></div>
    </>
  );
}

export default Navbar;
