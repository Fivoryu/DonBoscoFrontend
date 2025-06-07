import { SidebarSection } from "./Sidebar";
import { useAuth } from "@/app/contexts/AuthContext";

export function useSidebarFiltrado(sections: SidebarSection[]) {
  const { hasRole, user, permisosPuesto } = useAuth();

  // Helper: si roles vacío, mostrar siempre
  const puedeVer = (roles: string[]) => {
    if (!roles || roles.length === 0) return true;
    return hasRole(roles);
  };

  // Helper: verifica si el permiso existe para el modelo y acción
  const tienePermiso = (modelo: string, accion: string) => {
    if (!permisosPuesto || permisosPuesto.length === 0) return true; // Si no hay permisos, mostrar todo (o nada)
    return permisosPuesto.some(
      (p) =>
        p.modelo.nombre.toLowerCase() === modelo.toLowerCase() &&
        p.accion.nombre.toLowerCase() === accion.toLowerCase()
    );
  };

  // Filtramos secciones e ítems según permisos y roles
  const seccionesFiltradas = sections
    .map((sec) => {
      // Filtra los items según permisos y roles
      const itemsFiltrados = sec.items.filter((it) => {
        // Oculta "Iniciar sesión" si ya hay usuario, y "Cerrar sesión" si no hay usuario
        if (it.to === "/login/" && user) return false;
        if (it.to === "__logout__" && !user) return false;
        
        if ((it as any).modelo && (it as any).accion) {
          return puedeVer(it.roles) && tienePermiso((it as any).modelo, (it as any).accion);
        }
        return puedeVer(it.roles);
      });
      return { ...sec, items: itemsFiltrados };
    })
    .filter((sec) => sec.items.length > 0);

  return seccionesFiltradas;
}
