import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "../services/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ⚡ Inicializamos user desde token al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decodificar payload del JWT manualmente
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(base64));

        setUser({
          nombre: decoded.nombre,
          email: decoded.sub,
          rol: decoded.rol,
          id: decoded.id
        });
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email, contrasena) => {
    const data = await loginUser(email, contrasena);
    const decoded = JSON.parse(atob(data.access_token.split(".")[1])); // decodificar payload

    setUser({
      nombre: decoded.nombre,
      email: decoded.sub,
      rol: decoded.rol,
      id: decoded.id
    });

    localStorage.setItem("token", data.access_token);
    return data;
  };

  const register = async (formData) => {
    const data = await registerUser(formData);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
