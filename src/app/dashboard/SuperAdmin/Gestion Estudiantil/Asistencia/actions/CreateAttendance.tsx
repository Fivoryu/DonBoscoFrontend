import { useAttendanceWizard } from "../context/AsistenciaWizardContext";
import { useCrearAsistenciaGeneral, useCrearAsistenciaClase, useColegios, useUnidadesByColegio, useCursosByUnidad } from "../hooks/useAsistencia";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge";

export default function CreateAttendance() {
  const { colegioId, unidadId, cursoId, tipoAsistencia } = useAttendanceWizard();
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const crearGeneral = useCrearAsistenciaGeneral();
  const crearClase = useCrearAsistenciaClase();

  console.log(colegioId, unidadId, cursoId)

  // Obtener nombres de colegio, unidad y curso
  const { data: colegios = [] } = useColegios();
  const colegioNombre = colegios.find(c => c.id === colegioId)?.nombre || "";
  const { data: unidades = [] } = useUnidadesByColegio(colegioId ?? 0);
  const unidadNombre = unidades.find(u => u.id === unidadId)?.nombre || "";
  const { data: cursos = [] } = useCursosByUnidad(unidadId ?? 0);
  const cursoNombre = cursos.find(c => c.id === cursoId)?.nombre || "";

  const handleCrear = () => {
    setMensaje(null);
    setLastStatus(null);
    const hoy = new Date().toISOString().slice(0, 10);
    if (!cursoId || !fecha) {
      setMensaje("Debe seleccionar un curso y una fecha válida.");
      setLastStatus("REC");
      return;
    }
    if (fecha > hoy) {
      setMensaje("No puede registrar asistencia en una fecha futura.");
      setLastStatus("REC");
      return;
    }
    if (tipoAsistencia === "general") {
      crearGeneral.mutate(
        [], // o el array de asistencias reales
        {
          onSuccess: () => {
            setMensaje("Asistencia general creada correctamente.");
            setLastStatus("APR");
          },
          onError: () => {
            setMensaje("Ya existe una asistencia general para este curso y fecha.");
            setLastStatus("SOL");
          },
        }
      );
    } else {
      crearClase.mutate(
        { claseId: cursoId, fecha, asistencias: [] },
        {
          onSuccess: () => {
            setMensaje("Asistencia por clase creada correctamente.");
            setLastStatus("APR");
          },
          onError: () => {
            setMensaje("Ya existe una asistencia por clase para este curso y fecha.");
            setLastStatus("SOL");
          },
        }
      );
    }
  };

  const isPending = tipoAsistencia === "general" ? crearGeneral.isPending : crearClase.isPending;
  const isDisabled = !cursoId || !fecha || isPending;
  const maxDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Nueva asistencia ({tipoAsistencia === "clase" ? "Por clase" : "General"})</h2>
      <div className="mb-4">
        <label className="font-medium mr-2">Fecha:</label>
        <input
          type="date"
          value={fecha}
          max={maxDate}
          onChange={e => setFecha(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleCrear}
        disabled={isDisabled}
      >
        {isPending ? "Creando..." : "Crear asistencia"}
      </button>
      {mensaje && (
        <div className={`mt-4 flex items-center gap-2 ${mensaje.includes("correctamente") ? "text-green-600" : "text-red-600"}`}>
          {lastStatus && <StatusBadge status={lastStatus} />}
          <span>{mensaje}</span>
        </div>
      )}
      <div className="text-gray-500 mt-4">
        Colegio: {colegioNombre || "-"}, Unidad: {unidadNombre || "-"}, Curso: {cursoNombre || "-"}
      </div>
    </div>
  );
}
