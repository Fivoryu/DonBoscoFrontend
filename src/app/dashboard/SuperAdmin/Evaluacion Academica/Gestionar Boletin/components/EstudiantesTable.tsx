import { useEffect, useState } from "react"
import AxiosInstance from "@/components/AxiosInstance"

interface Estudiante {
  id: number
  usuario: {
    nombre: string
    apellido: string
  }
}

interface Props {
  cursoId: number
  onVerBoletin: (estudianteId: number) => void
}

export default function EstudiantesTable({ cursoId, onVerBoletin }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])

  useEffect(() => {
    const cargarEstudiantes = async () => {
      try {
        const res = await AxiosInstance.get<Estudiante[]>(`/estudiantes/estudiantes/curso/${cursoId}/`)
        setEstudiantes(res.data)
      } catch (error) {
        console.error("❌ Error al cargar estudiantes:", error)
      }
    }

    if (cursoId) {
      cargarEstudiantes()
    }
  }, [cursoId])

  if (!cursoId) return null

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-3">Estudiantes del curso</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est, index) => (
            <tr key={est.id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{est.usuario.nombre} {est.usuario.apellido}</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => onVerBoletin(est.id)}
                >
                  Ver Boletín
                </button>
              </td>
            </tr>
          ))}
          {estudiantes.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                No hay estudiantes en este curso.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
