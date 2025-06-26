import { useColegios } from "../hooks/useAsistencia";

export default function SchoolSelect({ value, onChange }: { value?: number; onChange: (id: number) => void }) {
  const { data: colegios = [], isLoading, error } = useColegios();
  return (
    <div>
      <label className="block mb-1 font-medium">Colegio</label>
      {isLoading ? (
        <div className="text-gray-500">Cargando colegios...</div>
      ) : error ? (
        <div className="text-red-500">Error al cargar colegios</div>
      ) : (
        <select
          className="w-full border rounded px-3 py-2"
          value={value || ""}
          onChange={e => onChange(Number(e.target.value))}
          disabled={isLoading}
        >
          <option value="">Seleccione colegio...</option>
          {colegios.map(colegio => (
            <option key={colegio.id} value={colegio.id}>{colegio.nombre}</option>
          ))}
        </select>
      )}
    </div>
  );
}
