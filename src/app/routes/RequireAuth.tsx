import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

export default function RequireAuth({
  children,
  allowedRoles,
}: RequireAuthProps): JSX.Element {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/dashboard/no-permission" replace />;
  }

  return children;
}
