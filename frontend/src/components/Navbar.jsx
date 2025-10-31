import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-lg py-3">
        <div className="container-fluid">
          {/* LOGO */}
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Mi<span className="text-warning">Tienda</span>
          </Link>

          {/* TOGGLER MOBILE */}
          <button
            className="navbar-toggler border-0"
            type="button"
            aria-label="Abrir menú de navegación"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* LINKS */}
          <div
            className={`collapse navbar-collapse ${
              isOpen ? "show" : ""
            } justify-content-lg-end justify-content-center`}
          >
            <ul className="navbar-nav align-items-lg-center gap-3 text-center">
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-light" to="/">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-light" to="/productos">
                  Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-light" to="/nosotros">
                  Nosotros
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary text-light px-3 py-2 fw-bold" to="/carrito">
                  🛒 Carrito
                </Link>
              </li>

              {user ? (
                <>
                  {user.rol === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link fw-semibold text-warning" to="/admin">
                        ⚙️ Panel Admin
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <Link className="nav-link fw-semibold text-light" to="/perfil">
                      👤 {user.nombre}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-danger px-3 py-2 fw-bold"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="btn btn-primary px-3 py-2 fw-bold" to="/login">
                    Iniciar Sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Espacio igual a la altura del navbar */}
      <div style={{ height: "80px" }}></div>
    </>
  );
}

export default Navbar;
