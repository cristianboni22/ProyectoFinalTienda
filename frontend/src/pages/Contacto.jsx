// src/pages/Contact.jsx
import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("¡Mensaje enviado con éxito!");
    setFormData({ nombre: "", email: "", mensaje: "" });
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-5">Contáctanos</h2>
      <div className="row g-4">
        {/* Formulario de contacto */}
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4 border-0 p-4">
            <h5 className="mb-4 fw-bold text-dark">Envíanos un mensaje</h5>
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                <span className="input-group-text bg-dark text-warning border-end-0">
                  <FaEnvelope />
                </span>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-control border-start-0"
                  required
                />
              </div>

              <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                <span className="input-group-text bg-dark text-warning border-end-0">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control border-start-0"
                  required
                />
              </div>

              <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                <textarea
                  name="mensaje"
                  placeholder="Mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="form-control"
                  rows="5"
                  style={{ resize: "none" }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn fw-bold py-2 mt-2"
                style={{
                  background: "linear-gradient(90deg, #d4af37, #b8860b)",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "black",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4 border-0 p-4 text-dark bg-light">
            <h5 className="mb-4 fw-bold">Nuestra información</h5>
            <p className="d-flex align-items-center gap-2">
              <FaMapMarkerAlt className="text-warning" /> Calle Alcala, Madrid, España
            </p>
            <p className="d-flex align-items-center gap-2">
              <FaPhone className="text-warning" /> +34 123 456 789
            </p>
            <p className="d-flex align-items-center gap-2">
              <FaEnvelope className="text-warning" /> contacto@mitienda.com
            </p>
            <div className="mt-4">
              <iframe
                title="mapa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.815948241293!2d-3.703790384596857!3d40.41677597936408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42288b3b0b0db7%3A0x9e1f34e4a3d3e12a!2sMadrid!5e0!3m2!1ses!2ses!4v1686789900000!5m2!1ses!2ses"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: "1rem" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
