import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./admin/AdminSidebar";
import DashboardHome from "./admin/DashboardHome";
import AdminProductos from "./admin/AdminProductos";
import AdminCategorias from "./admin/AdminCategorias";
import AdminUsuarios from "./admin/AdminUsuarios";
import AdminPedidos from "./admin/AdminPedidos";

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

  if (loading) return <p className="text-center mt-5">Cargando panel...</p>;
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
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 bg-dark text-white vh-100 p-0">
          <AdminSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>

        {/* Contenido */}
        <div className="col-12 col-md-9 col-lg-10 p-4">
          <h2 className="mb-4 text-primary">Panel de Administración</h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
