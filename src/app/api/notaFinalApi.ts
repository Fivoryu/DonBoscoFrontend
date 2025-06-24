import api from "./axiosInstance";

const URL = "notas-finales/";

export const getNotasFinales = () => api.get(URL);
export const getNotaFinal = (id: number) => api.get(`${URL}${id}/`);
export const createNotaFinal = (data: any) => api.post(URL, data);
export const updateNotaFinal = (id: number, data: any) => api.put(`${URL}${id}/`, data);
export const deleteNotaFinal = (id: number) => api.delete(`${URL}${id}/`);
