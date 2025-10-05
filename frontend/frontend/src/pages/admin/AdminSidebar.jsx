function AdminSidebar({ setActiveTab, activeTab }) {
  const items = [
    { id: "dashboard", label: "🏠 Inicio" },
    { id: "productos", label: "🛍️ Productos" },
    { id: "categorias", label: "📂 Categorías" },
    { id: "usuarios", label: "👥 Usuarios" },
    { id: "pedidos", label: "📦 Pedidos" },
  ];

  return (
    <div className="d-flex flex-column p-3 h-100">
      <h4 className="text-center mb-4">Admin</h4>
      <ul className="nav nav-pills flex-column">
        {items.map((item) => (
          <li key={item.id} className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${
                activeTab === item.id ? "btn-primary" : "btn-outline-light"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminSidebar;
