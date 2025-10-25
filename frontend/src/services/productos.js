// src/services/productos.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // ⚠️ cambia esto si tu backend corre en otro host/puerto
});

// Obtener productos (puedes pasar filtros si tu backend los soporta)
export async function getProductos(params = {}) {
  const res = await api.get("/producto/", { params });
  return res.data;
}

export async function getProductoById(id) {
  const res = await api.get(`/producto/${id}`);
  return res.data;
}
