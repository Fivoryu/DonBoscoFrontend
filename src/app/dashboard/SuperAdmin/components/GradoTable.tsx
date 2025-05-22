import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa } from "@/app/modelos/Institucion";
import { useMemo, useState } from "react";

interface Props {
  grados: Grado[];
  unidades: UnidadEducativa[];
  sortKey: keyof Grado;
  asc: boolean;
  onToggleSort: (k: keyof Grado) => void;
  onEdit: (g: Grado) => void;
  onDelete: (id: number) => void;
}

const cols: Array<[keyof Grado, string]> = [
  ["nivelEducativo", "Nivel"],
  ["unidadEducativaId", "Unidad Educativa"]
];

export default function GradosTable({ grados, unidades, sortKey, asc, onToggleSort, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return grados;
    return grados.filter(g =>
      g.nivelEducativo.toLowerCase().includes(term) ||
      (unidades.find(u => u.id === g.unidadEducativaId)?.nombre?.toLowerCase() ?? "").includes(term)
    );
  }, [search, grados, unidades]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    }),
    [filtered, sortKey, asc]
  );

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
      <table className="table-auto w-full text-sm whitespace-nowrap">
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {cols.map(([key, label]) => {
              const active = sortKey === key;
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
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
              const unidad = unidades.find(u => u.id === g.unidadEducativaId);
              return (
                <tr key={g.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{g.nivelEducativo}</td>
                  <td className="px-4 py-3">{unidad?.nombre ?? "–"}</td>
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
      </table>
    </div>
  );
}