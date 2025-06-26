import { useUnidadesByColegio } from "../hooks/useAsistencia";

export default function UnitSelect({ colegioId, value, onChange }: { colegioId?: number; value?: number; onChange: (id: number) => void }) {
  const { data: unidades = [], isLoading, error } = useUnidadesByColegio(colegioId ?? 0);
  return (
    <div>
      <label className="block mb-1 font-medium">Unidad educativa</label>
      {isLoading ? (
        <div className="text-gray-500">Cargando unidades educativas...</div>
      ) : error ? (
        <div className="text-red-500">Error al cargar unidades educativas</div>
      ) : (
        <select
          className="w-full border rounded px-3 py-2"
          value={value || ""}
          onChange={e => onChange(Number(e.target.value))}
          disabled={!colegioId}
        >
          <option value="">Seleccione unidad educativa...</option>
          {unidades.map(unidad => (
            <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
          ))}
        </select>
      )}
    </div>
  );
}
