import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-2" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-primary w-100" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;