import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import Table from "@/components/Table";
import { Materia } from "@/app/modelos/Academico";
import { useMemo, useState } from "react";

interface Props {
  materias: Materia[];
  sortKey: keyof Materia;
  asc: boolean;
  onToggleSort: (k: keyof Materia) => void;
  onEdit: (m: Materia) => void;
  onDelete: (id: number) => void;
}

const cols: Array<[keyof Materia, string]> = [
  ["nombre", "Nombre"],
];

export default function MateriaTable({
  materias,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return materias;
    return materias.filter(m =>
      m.nombre.toLowerCase().includes(term)
    );
  }, [search, materias]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      if (typeof A === "string" && typeof B === "string") {
        return asc
          ? A.localeCompare(B)
          : B.localeCompare(A);
      }
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar materias..."
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
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
                  className="px-4 py-3 whitespace-nowrap cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active && (
                      asc
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                    )}
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
              <td colSpan={cols.length + 1} className="p-8 text-center text-gray-500">
                Sin materias
              </td>
            </tr>
          ) : (
            sorted.map(m => (
              <tr key={m.id} className="hover:bg-blue-50">
                <td className="px-4 py-3 text-center">{m.nombre}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(m)}
                    className="mr-2 text-blue-600 hover:underline"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(m.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
