import AxiosInstance from "@/components/AxiosInstance";
import { PermisoRol } from "@/app/modelos/Usuarios";

export const getPermisosByRol = (rolId: number) => 
  AxiosInstance.get<PermisoRol[]>(`/user/auth/permisos-rol/?rol=${rolId}`)
  .then(res => res.data);

export const crearPermisoRol = (payload: { rol_id: number; modelo_id: number; accion_id: number }) => 
  AxiosInstance.post("/user/auth/permisos-rol/", payload)
  .then(res => res.data);

export const eliminarPermisoRol = (permisoId: number) => 
  AxiosInstance.delete(`/user/auth/permisos-rol/${permisoId}/`);