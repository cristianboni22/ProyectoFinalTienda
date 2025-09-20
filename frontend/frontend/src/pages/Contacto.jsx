// src/pages/Contacto.jsx
function Contacto() {
  return (
    <div className="container my-5">
      <h2>Contacto</h2>
      <form className="mt-3">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" placeholder="Tu nombre" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="tu@email.com" />
        </div>
        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea className="form-control" rows="4"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
}

export default Contacto;
