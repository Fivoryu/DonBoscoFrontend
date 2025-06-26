import { useEffect, useState } from "react"
import AxiosInstance from "@/components/AxiosInstance"

interface Curso {
  id: number
  nombre: string
}

interface Props {
  onCursoSeleccionado: (id: number) => void
}

export default function CursoSelector({ onCursoSeleccionado }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [cursoId, setCursoId] = useState<number | "">("")

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    setCursoId(value)
    if (!isNaN(value)) {
      onCursoSeleccionado(value)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Selecciona un curso</label>
      <select
        className="border rounded p-2 w-64"
        value={cursoId}
        onChange={handleChange}
      >
        <option value="">-- Seleccionar --</option>
        {cursos.map(curso => (
          <option key={curso.id} value={curso.id}>
            {curso.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}
