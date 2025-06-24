import AxiosInstance from "@/components/AxiosInstance";
import { Licencia } from "@/app/modelos/Asistencia";

export async function getLicenciasByTutor(tutorId: number): Promise<Licencia[]> {
  const res = await AxiosInstance.get(`/asistencia/licencias/?tutor=${tutorId}`);
  return res.data;
}

export async function createLicencia(data: Partial<Licencia>): Promise<Licencia> {
  const res = await AxiosInstance.post("/asistencia/licencias/", data);
  return res.data;
}

export async function editLicencia({ id, ...data }: Partial<Licencia> & { id: number }): Promise<Licencia> {
  const res = await AxiosInstance.put(`/asistencia/licencias/${id}/`, data);
  return res.data;
}

export async function deleteLicencia(id: number): Promise<void> {
  await AxiosInstance.delete(`/asistencia/licencias/${id}/`);
}
