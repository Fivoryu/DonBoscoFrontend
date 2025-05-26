import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa } from "@/app/modelos/Institucion";
import { useMemo, useState } from "react";
import Table from "@/components/Table";

interface Props {
  grados: Grado[];
  unidades: UnidadEducativa[];
  sortKey: keyof Grado;
  asc: boolean;
  onToggleSort: (k: keyof Grado) => void;
  onEdit: (g: Grado) => void;
  onDelete: (id: number) => void;
}

const cols: Array<[keyof Grado | 'colegio', string]> = [
  ['colegio', 'Colegio'],
  ['unidad_educativa', 'Unidad Educativa'],
  ['nivel_educativo', 'Nivel'],
  ['numero', 'Número'],
  ['nombre', 'Nombre'],
];

export default function GradosTable({
  grados,
  unidades,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete
}: Props) {
  const [search, setSearch] = useState("");

  // Filtrado por nivel o nombre de unidad educativa
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return grados;
    return grados.filter(g =>
      g.nivel_educativo.toLowerCase().includes(term) ||
      (unidades.find(u => u.id === (typeof g.unidad_educativa === "number" ? g.unidad_educativa : g.unidad_educativa.id))?.nombre?.toLowerCase() ?? "").includes(term)
    );
  }, [search, grados, unidades]);

  // Ordenamiento dinámico
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar grados o unidades..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {cols.map(([key, label]) => {
              const active = sortKey === key;
              const isGradoKey = key !== "colegio";
              return (
                <th
                  key={key}
                  onClick={isGradoKey ? () => onToggleSort(key as keyof Grado) : undefined}
                  className="px-4 py-3 text-left cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active && (asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </span>
                </th>
              );
            })}
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={cols.length + 1} className="p-8 text-center text-gray-500">Sin grados</td>
            </tr>
          ) : (
            sorted.map(g => {
              const unidad = g.unidad_educativa;
              const colegioNombre = unidad?.colegio?.nombre ?? '-';
              const unidadNombre = unidad?.nombre ?? '-';

              return (
                <tr key={g.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{colegioNombre}</td>
                  <td className="px-4 py-3">{unidadNombre}</td>
                  <td className="px-4 py-3">{g.nivel_educativo}</td>
                  <td className="px-4 py-3">{g.numero}</td>
                  <td className="px-4 py-3">{g.nombre ?? "–"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(g)} className="mr-2 text-blue-600 hover:underline">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(g.id)} className="text-red-600 hover:underline">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}