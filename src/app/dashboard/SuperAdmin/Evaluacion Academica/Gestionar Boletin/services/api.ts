import AxiosInstance from "@/components/AxiosInstance"
import { NotaFinalMateria } from "../types"

interface NotasEstudianteResponse {
  notas_finales: NotaFinalMateria[]
  notas_actividades: any[]
}

export async function obtenerNotasEstudiante(estudianteId: number): Promise<NotasEstudianteResponse> {
  try {
    const res = await AxiosInstance.get(`/estudiantes/estudiantes/${estudianteId}/notas/`)
    return res.data
  } catch (error: any) {
    console.error("❌ Error al obtener las notas del estudiante:", error.response?.data || error.message)
    throw error
  }
}
