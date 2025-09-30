import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Cambia esto por la URL de tu backend

export const getFeaturedProducts = async () => {
  const res = await axios.get(`${API_URL}/productos?destacados=true`);
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/categorias`);
  return res.data;
};

export const getProducts = async (categoryId) => {
  const url = categoryId ? `${API_URL}/productos?categoria=${categoryId}` : `${API_URL}/productos`;
  const res = await axios.get(url);
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