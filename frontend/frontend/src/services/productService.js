// services/productService.js
const API_URL = "http://localhost:8000"; // apunta a tu backend

// Obtener todos los productos
export async function getProducts() {
  const response = await fetch(`${API_URL}/productos`);
  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }
  return response.json(); // devuelve la lista de productos
}

// Obtener producto por id
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/productos/${id}`);
  if (!response.ok) {
    throw new Error("Error al obtener producto");
  }
  return response.json();
}