import api from "./axiosInstance"; // instancia personalizada de Axios

// ACTIVIDADES
export const getActividades = (params?: any) => api.get("/actividades/", { params });
export const createActividad = (data: any) => api.post("/actividades/", data);
export const updateActividad = (id: number, data: any) => api.put(`/actividades/${id}/`, data);
export const deleteActividad = (id: number) => api.delete(`/actividades/${id}/`);
export const getNotasPorActividad = (id: number) => api.get(`/actividades/${id}/notas/`);

// NOTAS POR ACTIVIDAD
export const getNotasActividad = (params?: any) => api.get("/notas-actividades/", { params });
export const createNotaActividad = (data: any) => api.post("/notas-actividades/", data);
export const updateNotaActividad = (id: number, data: any) => api.put(`/notas-actividades/${id}/`, data);
export const deleteNotaActividad = (id: number) => api.delete(`/notas-actividades/${id}/`);

// NOTAS FINALES POR MATERIA
export const getNotasFinales = (params?: any) => api.get("/notas-finales/", { params });
export const createNotaFinal = (data: any) => api.post("/notas-finales/", data);
export const updateNotaFinal = (id: number, data: any) => api.put(`/notas-finales/${id}/`, data);
export const deleteNotaFinal = (id: number) => api.delete(`/notas-finales/${id}/`);
