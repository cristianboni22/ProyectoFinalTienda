import { useState } from 'react';
import { registerUser } from '../services/auth';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(email, password);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-2" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-success w-100" type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
}

export default Register;