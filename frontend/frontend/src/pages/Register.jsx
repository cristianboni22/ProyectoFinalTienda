// src/pages/Register.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaHome, FaPhone } from "react-icons/fa";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    direccion: "",
    telefono: "",
    rol: "cliente",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(formData);
      alert("Usuario registrado correctamente.");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.detail) {
        const details = err.response.data.detail;
        if (Array.isArray(details)) {
          setError(details.map((d) => d.msg).join(", "));
        } else {
          setError(details);
        }
      } else {
        setError("Error al registrar usuario");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "80vh",
        backgroundColor: "#121212", // fondo negro
      }}
    >
      <div
        className="card p-4 p-md-5 shadow-lg rounded-4"
        style={{
          maxWidth: "450px",
          width: "100%",
          backgroundColor: "#1c1c1c", // card oscuro
          border: "2px solid #FFD700", // borde dorado
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#FFD700" }}>
          Registro
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* Nombre */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaUser />
            </span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="form-control border-start-0"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Apellido */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaUser />
            </span>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              className="form-control border-start-0"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control border-start-0"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaLock />
            </span>
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              className="form-control border-start-0"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dirección */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaHome />
            </span>
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              className="form-control border-start-0"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          {/* Teléfono */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaPhone />
            </span>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              className="form-control border-start-0"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="btn fw-bold py-2 mt-2"
            style={{
              backgroundColor: "#FFD700",
              color: "#121212",
              border: "none",
              borderRadius: "0.75rem",
              transition: "0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.backgroundColor = "#FFC700";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.backgroundColor = "#FFD700";
            }}
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-center text-warning">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-white fw-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
