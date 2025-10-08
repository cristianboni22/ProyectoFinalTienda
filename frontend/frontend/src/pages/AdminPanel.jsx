import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./admin/AdminSidebar";
import DashboardHome from "./admin/DashboardHome";
import AdminProductos from "./admin/AdminProductos";
import AdminCategorias from "./admin/AdminCategorias";
import AdminUsuarios from "./admin/AdminUsuarios";
import AdminPedidos from "./admin/AdminPedidos";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/usuario/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        if (res.data.rol !== "admin") {
          navigate("/");
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-warning">
        <div className="spinner-border text-warning me-2" />
        <span>Cargando panel...</span>
      </div>
    );

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "productos":
        return <AdminProductos />;
      case "categorias":
        return <AdminCategorias />;
      case "usuarios":
        return <AdminUsuarios />;
      case "pedidos":
        return <AdminPedidos />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div
      className="d-flex"
      style={{
        width: "100%",
        overflowX: "hidden",
        background: "linear-gradient(180deg, #000 0%, #1a1a1a 100%)",
        color: "#fff",
      }}
    >
      {/* Sidebar 30% */}
      <div
        className="d-flex flex-column text-light shadow"
        style={{
          width: "30%",
          background:
            "linear-gradient(180deg, #000000 0%, #0f0f0f 50%, #1a1a1a 100%)",
          borderRight: "2px solid #c5a100",
        }}
      >
        <div className="text-center py-4 border-bottom border-warning">
          <h3 className="fw-bold text-warning">ADMIN</h3>
          <p className="text-warning small mb-0">Gestión de tienda</p>
        </div>

        <nav className="nav flex-column mt-3 align-self-center">
          {[
            { key: "dashboard", label: "🏠 Dashboard" },
            { key: "productos", label: "🛍️ Productos" },
            { key: "categorias", label: "📂 Categorías" },
            { key: "usuarios", label: "👤 Usuarios" },
            { key: "pedidos", label: "📦 Pedidos" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`nav-link text-start ${
                activeTab === tab.key ? "text-warning fw-bold" : "text-light"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

      </div>

      {/* Contenido 70% */}
      <div
        className="flex-grow-1 p-4"
        style={{
          width: "70%",
          background: "linear-gradient(180deg, #0b0b0b 0%, #1c1c1c 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-warning pb-2">
          <h2 className="fw-bold text-warning mb-0 text-capitalize">
            {activeTab === "dashboard"
              ? "Panel de Control"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
        </div>

        <div className="bg-dark p-4 rounded shadow border border-warning">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
