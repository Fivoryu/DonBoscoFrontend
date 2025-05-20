import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: JSX.Element;
  requireRole?: string;
}

export default function RequireAuth({ children, requireRole }: Props): JSX.Element {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="w-full h-full flex items-center justify-center">Cargando...</div>;
  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  if (requireRole && user.rol.nombre !== requireRole) {
    return <Navigate to="/dashboard/no-permission" state={{ from: loc }} replace />;
  }

  return children;
}
