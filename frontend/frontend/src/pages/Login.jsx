import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // Redirige al home o perfil
    } catch (error) {
      alert("Error en login: " + error.response?.data?.detail || "Intenta de nuevo");
    }
  };

  return (
    <div className="row justify-content-center my-5">
      <div className="col-md-4">
        <h2 className="mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="form-control mb-2"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100" type="submit">
            Entrar
          </button>
        </form>
        <p className="mt-3 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
