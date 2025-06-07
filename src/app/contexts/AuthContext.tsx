import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Usuario, PermisoPuesto, Admin } from "../modelos/Usuarios";

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  logout: () => Promise<void>;
  hasRole: (allowedRoles: string[]) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isProfesor: () => boolean;
  isEstudiante: () => boolean;
  isTutor: () => boolean;
  permisosPuesto: PermisoPuesto[];
  cargarPermisosPuesto: (puestoId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
  hasRole: () => false,
  isSuperAdmin: () => false,
  isAdmin: () => false,
  isProfesor: () => false,
  isEstudiante: () => false,
  isTutor: () => false,
  permisosPuesto: [],
  cargarPermisosPuesto: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [permisosPuesto, setPermisosPuesto] = useState<PermisoPuesto[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);

  // Al montar, recuperamos token y datos de usuario (si existe)
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Inyectar el token en los headers de AxiosInstance
    AxiosInstance.defaults.headers.common["Authorization"] = `Token ${token}`;

    // Intentar cargar el perfil desde la API
    AxiosInstance.get<Usuario>("/user/auth/usuarios/perfil/")
      .then((res) => {
        setUser(res.data);
        // Guardamos los datos en localStorage para recarga de página
        localStorage.setItem("datosDelUsuario", JSON.stringify(res.data));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("datosDelUsuario");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await AxiosInstance.post("/user/auth/usuarios/logout/");

      // Limpiar token y datos de usuario de ambos almacenes
      delete AxiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("datosDelUsuario");
      sessionStorage.removeItem("datosDelUsuario");

      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Función genérica para comprobar roles (case‐insensitive)
  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    const rolUser = user.rol.nombre.toLowerCase();
    return allowedRoles.map((r) => r.toLowerCase()).includes(rolUser);
  };

  // Helpers específicos de rol
  const isSuperAdmin = () => hasRole(["superadmin"]);
  const isAdmin = () => hasRole(["admin"]);
  const isProfesor = () => hasRole(["profesor"]);
  const isEstudiante = () => hasRole(["estudiante"]);
  const isTutor = () => hasRole(["tutor"]);

  // Cargar datos de admin solo si el usuario es admin
  useEffect(() => {
    if (user?.id && user.rol.nombre.toLowerCase() === "admin") {
      AxiosInstance.get<Admin>(`/user/auth/admins/${user.id}/`)
        .then((res) => setAdmin(res.data))
        .catch(() => setAdmin(null));
    } else {
      setAdmin(null);
    }
  }, [user?.id, user?.rol?.nombre]);

  const cargarPermisosPuesto = async (puestoId: number) => {
    try {
      console.log("[DEBUG] Solicitando permisos para puesto", puestoId);
      const res = await AxiosInstance.get<PermisoPuesto[]>(`/user/auth/permisos-puesto/?puesto_id=${puestoId}`);
      setPermisosPuesto(res.data);
    } catch {
      setPermisosPuesto([]);
    }
  };

  // Cargar permisos del puesto solo si el usuario es admin y tiene puesto
  useEffect(() => {
    if (user?.rol.nombre.toLowerCase() === "admin" && admin?.puesto?.id) {
      cargarPermisosPuesto(admin.puesto.id);
    } else {
      setPermisosPuesto([]);
    }
  }, [user?.rol?.nombre, admin?.puesto?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
        hasRole,
        isSuperAdmin,
        isAdmin,
        isProfesor,
        isEstudiante,
        isTutor,
        permisosPuesto,
        cargarPermisosPuesto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
