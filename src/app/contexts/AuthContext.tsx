import React, { createContext, useContext, useEffect, useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Usuario } from "../modelos/Usuarios";

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {}, // Proporcionar una función por defecto vacía
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar el perfil del usuario desde el backend al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    AxiosInstance.get("/user/auth/usuarios/perfil/")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Función logout
  const logout = async () => {
    try {
      await AxiosInstance.post("/user/auth/usuarios/logout/");  // Llamar al backend para hacer logout
      localStorage.removeItem("token"); // Eliminar el token solo en este dispositivo
      setUser(null);  // Limpiar el estado global de usuario
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
