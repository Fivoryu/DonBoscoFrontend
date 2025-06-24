import { useState } from "react"
import CursoSelector from "./components/CursoSelector"
import EstudiantesTable from "./components/EstudiantesTable"
import BoletinEstudiante from "./components/BoletinDetalle"

export default function GestionarBoletinPage() {
  const [cursoId, setCursoId] = useState<number | null>(null)
  const [estudianteId, setEstudianteId] = useState<number | null>(null)

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Generar Boletín</h1>

      <CursoSelector onCursoSeleccionado={setCursoId} />

      {cursoId && !estudianteId && (
        <EstudiantesTable cursoId={cursoId} onVerBoletin={setEstudianteId} />
      )}

      {estudianteId && (
        <BoletinEstudiante estudianteId={estudianteId} onVolver={() => setEstudianteId(null)} />
      )}
    </div>
  )
}
