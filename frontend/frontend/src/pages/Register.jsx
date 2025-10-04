import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
      navigate("/login"); // la navegación se hace aquí
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
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-4">Registro</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" className="form-control mb-2" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido" className="form-control mb-2" value={formData.apellido} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="form-control mb-2" value={formData.email} onChange={handleChange} required />
          <input type="password" name="contrasena" placeholder="Contraseña" className="form-control mb-2" value={formData.contrasena} onChange={handleChange} required />
          <input type="text" name="direccion" placeholder="Dirección" className="form-control mb-2" value={formData.direccion} onChange={handleChange} />
          <input type="text" name="telefono" placeholder="Teléfono" className="form-control mb-2" value={formData.telefono} onChange={handleChange} />

          <button type="submit" className="btn btn-primary w-100">Registrarse</button>
        </form>

        <div className="mt-3 text-center">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
