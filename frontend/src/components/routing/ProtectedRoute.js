import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Ako nije ulogovan, vrati ga na login
    return <Navigate to="/auth/login" />;
  }

  return children; // Ako jeste, prikaži stranicu
};

export default ProtectedRoute;