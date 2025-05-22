import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import { Curso, Paralelo } from "@/app/modelos/Academico";
import { useMemo, useState } from "react";

interface Props {
  cursos: Curso[];
  paralelos: Paralelo[];
  sortKey: keyof Curso;
  asc: boolean;
  onToggleSort: (k: keyof Curso) => void;
  onEdit: (c: Curso) => void;
  onDelete: (paraleloId: number) => void;
}

const cols: Array<[keyof Curso, string]> = [
  ["paraleloId", "Paralelo"],
  ["nombre", "Nombre Curso"],
];

export default function CursosTable({ cursos, paralelos, sortKey, asc, onToggleSort, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return cursos;
    return cursos.filter(c =>
      c.nombre.toLowerCase().includes(t) ||
      paralelos.find(p => p.id === c.paraleloId)?.letra.toLowerCase().includes(t)
    );
  }, [search, cursos, paralelos]);

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
          placeholder="Buscar cursos o paralelo..."
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
              <td colSpan={cols.length + 1} className="p-8 text-center">
                Sin cursos
              </td>
            </tr>
          ) : (
            sorted.map(c => {
              const paralelo = paralelos.find(p => p.id === c.paraleloId);
              return (
                <tr key={c.paraleloId} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{paralelo?.letra ?? "–"}</td>
                  <td className="px-4 py-3">{c.nombre}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(c)} className="mr-2 text-blue-600 hover:underline">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(c.paraleloId)} className="text-red-600 hover:underline">
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