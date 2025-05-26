import { ChevronUp, ChevronDown } from "lucide-react";
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

type CursoDisplay = Curso & {
  unidadEducativaNombre: string;
  colegioNobmre: string;
}

const cols: Array<[keyof CursoDisplay, string]> = [
  ["unidadEducativaNombre", "Unidad Educativa"],
  ["colegioNobmre", "Colegio"],
  ["nombre", "Nombre Curso"],
];

export default function CursosTable({ cursos, paralelos, sortKey, asc, onToggleSort }: Props) {
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
                  onClick={() => onToggleSort(key as keyof Curso)}
                  className="px-4 py-3 text-left cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active && (asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </span>
                </th>
              );
            })}
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
              return (
                <tr key={c.paraleloId} className="hover:bg-blue-50">
                  <td className="px-4 py-3">
                    {paralelos.find(p => p.id === c.paraleloId)?.grado?.unidad_educativa?.nombre || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {paralelos.find(p => p.id === c.paraleloId)?.grado?.unidad_educativa?.colegio?.nombre || "N/A"}
                  </td>
                  <td className="px-4 py-3">{c.nombre}</td>
                </tr>
              );
            })
          )}
        </tbody>

      </table>
    </div>
  );
}