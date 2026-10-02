import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowRoles }) {
  const { currentUser, profile } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowRoles && !allowRoles.includes(profile?.role)) return <Navigate to="/" replace />;
  return children;
}
