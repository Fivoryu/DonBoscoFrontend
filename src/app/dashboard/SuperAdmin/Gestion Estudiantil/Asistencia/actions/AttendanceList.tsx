import React, { useState, useEffect } from "react";
import { useAttendanceWizard } from "../context/AsistenciaWizardContext";
import { useEstudiantesByCurso, useAsistenciaGeneralByCursoAndFecha, useAsistenciaByClaseAndFecha } from "../hooks/useAsistencia";
import { useColegios, useUnidadesByColegio, useCursosByUnidad } from "../hooks/useAsistencia";
import { crearAsistenciaGeneral, crearAsistenciaClase } from "../services/asistencia.api";

export default function AttendanceList() {
  const { colegioId, unidadId, cursoId, tipoAsistencia } = useAttendanceWizard();
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));

  // Obtener estudiantes del curso
  const { data: estudiantes = [], isLoading: loadingEstudiantes } = useEstudiantesByCurso(cursoId ?? 0);

  // Obtener nombre del colegio, unidad y curso
  const { data: colegios = [] } = useColegios();
  const colegioNombre = colegios.find(c => c.id === colegioId)?.nombre || "";
  const { data: unidades = [] } = useUnidadesByColegio(colegioId ?? 0);
  const unidadNombre = unidades.find(u => u.id === unidadId)?.nombre || "";
  const { data: cursos = [] } = useCursosByUnidad(unidadId ?? 0);
  const cursoNombre = cursos.find(c => c.id === cursoId)?.nombre || "";

  // Obtener asistencias según tipo
  const {
    data: asistencias = [],
    isLoading: loadingAsistencias,
    error: errorAsistencias,
  } = tipoAsistencia === "clase"
    ? useAsistenciaByClaseAndFecha(cursoId ?? 0, fecha)
    : useAsistenciaGeneralByCursoAndFecha(cursoId ?? 0, fecha);

  type AsistenciaEdit = {
    estudiante: number;
    estado: string;
    hora_entrada: string;
    hora_salida: string;
    observaciones: string;
  };

  const [asistenciasEdit, setAsistenciasEdit] = useState<AsistenciaEdit[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Actualizar asistenciasEdit si cambia la lista de estudiantes o asistencias
  useEffect(() => {
    setAsistenciasEdit(
      estudiantes.map(est => {
        const asistencia = asistencias.find((a: any) => a.estudiante.id === est.id);
        return {
          estudiante: est.id,
          estado: asistencia?.estado || "ASI",
          hora_entrada: asistencia?.hora_entrada || "",
          hora_salida: asistencia?.hora_salida || "",
          observaciones: asistencia?.observaciones || ""
        };
      })
    );
  }, [estudiantes, asistencias]);

  const handleInputChange = (idx: number, field: keyof AsistenciaEdit, value: string) => {
    setAsistenciasEdit(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      if (tipoAsistencia === "clase") {
        const payload = {
          claseId: cursoId ?? 0,
          fecha,
          asistencias: asistenciasEdit.map(a => ({ ...a, fecha }))
        };
        console.log("Payload a enviar (clase):", payload);
        await crearAsistenciaClase(payload);
      } else {
        const payload = asistenciasEdit.map(a => ({
          ...a,
          fecha,
          hora_entrada: a.hora_entrada ? a.hora_entrada : null,
          hora_salida: a.hora_salida ? a.hora_salida : null,
        }));
        console.log("Payload a enviar (general):", payload);
        await crearAsistenciaGeneral(payload);
      }
      setSuccessMsg("¡Asistencias guardadas correctamente!");
    } catch (e) {
      setErrorMsg("Error al guardar asistencias");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Lista de asistencias ({tipoAsistencia === "clase" ? "Por clase" : "General"})</h2>
      <div className="mb-4">
        <label className="font-medium mr-2">Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      {loadingEstudiantes || loadingAsistencias ? (
        <div className="text-gray-500">Cargando datos...</div>
      ) : errorAsistencias ? (
        <div className="text-red-500">Error al cargar asistencias</div>
      ) : (
        <form onSubmit={handleGuardar}>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Estudiante</th>
                <th className="px-4 py-2 border">Estado</th>
                <th className="px-4 py-2 border">Hora entrada</th>
                <th className="px-4 py-2 border">Hora salida</th>
                <th className="px-4 py-2 border">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Sin estudiantes</td></tr>
              ) : (
                estudiantes.map((est, idx) => (
                  <tr key={est.id}>
                    <td className="px-4 py-2 border">{est.usuario.nombre} {est.usuario.apellido}</td>
                    <td className="px-4 py-2 border">
                      <select
                        value={asistenciasEdit[idx]?.estado}
                        onChange={e => handleInputChange(idx, "estado", e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="ASI">Asistió</option>
                        <option value="FAL">Faltó</option>
                        <option value="TAR">Tardó</option>
                        <option value="JUS">Justificó</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="time"
                        value={asistenciasEdit[idx]?.hora_entrada}
                        onChange={e => handleInputChange(idx, "hora_entrada", e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="time"
                        value={asistenciasEdit[idx]?.hora_salida}
                        onChange={e => handleInputChange(idx, "hora_salida", e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={asistenciasEdit[idx]?.observaciones}
                        onChange={e => handleInputChange(idx, "observaciones", e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar asistencia"}
            </button>
          </div>
          {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
          {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}
        </form>
      )}
      <div className="text-gray-500 mt-4">Colegio: {colegioNombre}, Unidad: {unidadNombre}, Curso: {cursoNombre}</div>
    </div>
  );
}
