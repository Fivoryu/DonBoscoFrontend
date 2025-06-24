import api from "./axiosInstance";

const URL = "actividades/";

export const getActividades = () => api.get(URL);
export const getActividad = (id: number) => api.get(`${URL}${id}/`);
export const createActividad = (data: any) => api.post(URL, data);
export const updateActividad = (id: number, data: any) => api.put(`${URL}${id}/`, data);
export const deleteActividad = (id: number) => api.delete(`${URL}${id}/`);
