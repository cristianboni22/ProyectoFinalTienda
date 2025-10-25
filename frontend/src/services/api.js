import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`; // Cambia esto por la URL de tu backend

export const getFeaturedProducts = async () => {
  const res = await axios.get(`${API_URL}/producto?destacados=true`);
  return res.data;
};

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.id_categoria) params.append("id_categoria", filters.id_categoria);
  if (filters.id_subcategoria) params.append("id_subcategoria", filters.id_subcategoria);
  if (filters.precio_min) params.append("precio_min", filters.precio_min);
  if (filters.precio_max) params.append("precio_max", filters.precio_max);

  const res = await axios.get(`${API_URL}/producto/`, { params });
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/categoria/`);
  return res.data;
};

export const getProductDetail = async (id) => {
  const res = await axios.get(`${API_URL}/producto/${id}`);
  return res.data;
};

export const getUserOrders = async (userId) => {
  const res = await axios.get(`${API_URL}/usuario/${userId}/pedidos`);
  return res.data;
};