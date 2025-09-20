import axios from "axios";

// URL base correcta para tu backend
const API_URL = "http://localhost:8000";

const productService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/producto/`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/producto/${id}`);
    return response.data;
  },

  create: async (producto) => {
    const response = await axios.post(`${API_URL}/producto/`, producto);
    return response.data;
  },

  update: async (id, producto) => {
    const response = await axios.put(`${API_URL}/producto/${id}`, producto);
    return response.data;
  },

  delete: async (id) => {
    await axios.delete(`${API_URL}/producto/${id}`);
  },
};

export default productService;
