import { useAttendanceWizard } from "../context/AsistenciaWizardContext";
import { useEstudiantesByCurso, useAsistenciaGeneralByCursoAndFecha, usePorcentajeAsistenciaByCurso } from "../hooks/useAsistencia";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge";

function getPorcentajeStatus(p: number) {
  if (p >= 95) return "APR"; // Aprobada
  if (p >= 80) return "SOL"; // Advertencia
  if (p > 0) return "REC"; // Rechazada
  return "FIN"; // Sin datos
}

const STATUS_TOOLTIPS: Record<string, string> = {
  APR: "Excelente asistencia",
  SOL: "Advertencia: asistencia aceptable",
  REC: "Baja asistencia",
  FIN: "Sin datos en el rango",
};

export default function AttendanceStats() {
  const { cursoId } = useAttendanceWizard();
  const [rango, setRango] = useState<{ desde: string; hasta: string }>({
    desde: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10),
    hasta: new Date().toISOString().slice(0, 10),
  });
  const { data: estudiantes = [], isLoading: loadingEstudiantes, error: errorEstudiantes } = useEstudiantesByCurso(cursoId ?? 0);
  const { data: asistencias = [], isLoading: loadingAsistencias, error: errorAsistencias } = useAsistenciaGeneralByCursoAndFecha(cursoId ?? 0, "");

  if (loadingEstudiantes || loadingAsistencias) {
    return <div className="text-gray-500 p-6">Cargando datos...</div>;
  }
  if (errorEstudiantes || errorAsistencias) {
    return <div className="text-red-500 p-6">Error al cargar datos</div>;
  }
  if (estudiantes.length === 0) {
    return <div className="text-gray-400 p-6">No hay estudiantes en este curso.</div>;
  }

  // Filtra asistencias por rango de fechas
  const asistenciasFiltradas = asistencias.filter(a =>
    (!rango.desde || a.fecha >= rango.desde) && (!rango.hasta || a.fecha <= rango.hasta)
  );
  const { porcentaje } = usePorcentajeAsistenciaByCurso(asistenciasFiltradas, estudiantes);
  const status = getPorcentajeStatus(porcentaje);
  const tooltip = STATUS_TOOLTIPS[status] || "";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Porcentaje de asistencia</h2>
      <div className="mb-4 flex gap-4 items-center">
        <label>Desde:</label>
        <input type="date" value={rango.desde} max={rango.hasta} onChange={e => setRango(r => ({ ...r, desde: e.target.value }))} />
        <label>Hasta:</label>
        <input type="date" value={rango.hasta} min={rango.desde} max={new Date().toISOString().slice(0, 10)} onChange={e => setRango(r => ({ ...r, hasta: e.target.value }))} />
      </div>
      {asistenciasFiltradas.length === 0 ? (
        <div className="flex items-center gap-2 text-gray-400">
          <StatusBadge status={status} />
          <span>Sin datos en el rango seleccionado.</span>
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-2">
          <span className="text-3xl font-bold text-blue-700">{porcentaje.toFixed(2)}%</span>
          <span title={tooltip}><StatusBadge status={status} /></span>
          <span className="text-sm text-gray-500">{asistenciasFiltradas.length} asistencias, {estudiantes.length} estudiantes</span>
        </div>
      )}
    </div>
  );
}
