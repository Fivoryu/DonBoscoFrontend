import api from "./axiosInstance";

const URL = "auto-evaluaciones/";

export const getAutoEvaluaciones = () => api.get(URL);
export const getAutoEvaluacion = (id: number) => api.get(`${URL}${id}/`);
export const createAutoEvaluacion = (data: any) => api.post(URL, data);
export const updateAutoEvaluacion = (id: number, data: any) => api.put(`${URL}${id}/`, data);
export const deleteAutoEvaluacion = (id: number) => api.delete(`${URL}${id}/`);
