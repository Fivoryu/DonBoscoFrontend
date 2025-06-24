import api from "./axiosInstance";

const URL = "notas-actividades/";

export const getNotasActividad = (params?: any) => api.get(URL, { params });
export const getNotaActividad = (id: number) => api.get(`${URL}${id}/`);
export const createNotaActividad = (data: any) => api.post(URL, data);
export const updateNotaActividad = (id: number, data: any) => api.put(`${URL}${id}/`, data);
export const deleteNotaActividad = (id: number) => api.delete(`${URL}${id}/`);
