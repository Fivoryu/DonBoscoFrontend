import AxiosInstance from "@/components/AxiosInstance"
import { useEffect, useState } from "react"

interface Curso {
  id: number
  nombre: string
}

interface Estudiante {
  id: number
  usuario: {
    nombre: string
    apellido: string
  }
}

interface Props {
  onEstudianteSeleccionado: (id: number) => void
}

export default function CursoEstudianteSelector({ onEstudianteSeleccionado }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState<number | null>(null)

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const res = await AxiosInstance.get<Curso[]>("/academico/cursos/")
        setCursos(res.data)
      } catch (error) {
        console.error("❌ Error al cargar cursos:", error)
      }
    }
    cargarCursos()
  }, [])

  useEffect(() => {
    const cargarEstudiantes = async () => {
      if (cursoSeleccionado !== null) {
        try {
          const res = await AxiosInstance.get<Estudiante[]>(`/estudiantes/estudiantes/curso/${cursoSeleccionado}/`)
          setEstudiantes(res.data)
        } catch (error) {
          console.error("❌ Error al cargar estudiantes del curso:", error)
        }
      }
    }
    cargarEstudiantes()
  }, [cursoSeleccionado])

  return (
    <div className="flex flex-col gap-4 md:flex-row items-center">
      <div>
        <label className="block text-sm font-medium mb-1">Curso</label>
        <select
          className="border rounded p-2 w-64"
          value={cursoSeleccionado ?? ""}
          onChange={e => setCursoSeleccionado(Number(e.target.value))}
        >
          <option value="">Selecciona un curso</option>
          {cursos.map(curso => (
            <option key={curso.id} value={curso.id}>
              {curso.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estudiante</label>
        <select
          className="border rounded p-2 w-64"
          disabled={estudiantes.length === 0}
          value=""
          onChange={e => onEstudianteSeleccionado(Number(e.target.value))}
        >
          <option value="">Selecciona un estudiante</option>
          {estudiantes.map(est => (
            <option key={est.id} value={est.id}>
              {est.usuario.nombre} {est.usuario.apellido}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
