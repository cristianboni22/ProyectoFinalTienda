const API_URL = "http://localhost:8000"; // Cambiar según tu backend

export const fetchProductos = async () => {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
};

export const fetchProductoById = async (id) => {
  const res = await fetch(`${API_URL}/productos/${id}`);
  return res.json();
};

export const addToCart = async (userId, producto) => {
  const res = await fetch(`${API_URL}/carrito`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, producto }),
  });
  return res.json();
};