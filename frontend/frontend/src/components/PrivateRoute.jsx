import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Si no hay usuario logueado, redirige a login
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, renderiza los hijos (página protegida)
  return children;
}

export default PrivateRoute;
