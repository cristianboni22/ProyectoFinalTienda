import axios from "axios";

const API_URL = "http://mitiendaproyecto.zapto.org:8000/auth";

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const loginUser = async (email, password) => {
  const params = new URLSearchParams();
  params.append("username", email); // Obligatorio para OAuth2PasswordRequestForm
  params.append("password", password);

  const res = await axios.post("http://mitiendaproyecto.zapto.org:8000/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  localStorage.setItem("token", res.data.access_token); // Guardar token
  return res.data;
};
