// src/pages/Login.jsx
import React from 'react';
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      alert(
        "Error en login: " + error.response?.data?.detail || "Intenta de nuevo"
      );
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
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#1c1c1c", // card oscuro
          border: "2px solid #FFD700", // borde dorado
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#FFD700" }}>
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* Email */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaEnvelope />
            </span>
            <input
              className="form-control border-start-0"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-dark">
            <span className="input-group-text bg-dark border-end-0 text-warning">
              <FaLock />
            </span>
            <input
              className="form-control border-start-0"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-warning">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-white fw-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
