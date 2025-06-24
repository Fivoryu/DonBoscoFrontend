import api from "./axiosInstance";

const URL = "dimensiones/";

export const getDimensiones = () => api.get(URL);
export const getDimension = (id: number) => api.get(`${URL}${id}/`);
export const createDimension = (data: any) => api.post(URL, data);
export const updateDimension = (id: number, data: any) => api.put(`${URL}${id}/`, data);
export const deleteDimension = (id: number) => api.delete(`${URL}${id}/`);
