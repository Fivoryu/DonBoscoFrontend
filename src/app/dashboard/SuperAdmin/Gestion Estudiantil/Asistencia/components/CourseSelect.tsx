import { useCursosByUnidad } from "../hooks/useAsistencia";

export default function CourseSelect({ unidadId, value, onChange }: { unidadId?: number; value?: number; onChange: (id: number) => void }) {
  const { data: cursos = [], isLoading, error } = useCursosByUnidad(unidadId ?? 0);
  return (
    <div>
      <label className="block mb-1 font-medium">Curso</label>
      {isLoading ? (
        <div className="text-gray-500">Cargando cursos...</div>
      ) : error ? (
        <div className="text-red-500">Error al cargar cursos</div>
      ) : (
        <select
          className="w-full border rounded px-3 py-2"
          value={value || ""}
          onChange={e => onChange(Number(e.target.value))}
          disabled={!unidadId}
        >
          <option value="">Seleccione curso...</option>
          {cursos.map(curso => (
            <option key={curso.id} value={curso.id}>{curso.nombre}</option>
          ))}
        </select>
      )}
    </div>
  );
}
