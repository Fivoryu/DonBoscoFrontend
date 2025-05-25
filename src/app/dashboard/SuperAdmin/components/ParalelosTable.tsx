import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import { Paralelo, Grado } from "@/app/modelos/Academico";
import { useMemo, useState } from "react";
import Table from "@/components/Table";

interface Props {
  paralelos: Paralelo[];
  grados: Grado[];
  sortKey: keyof Paralelo;
  asc: boolean;
  onToggleSort: (k: keyof Paralelo) => void;
  onEdit: (p: Paralelo) => void;
  onDelete: (id: number) => void;
}

const colsP: Array<[keyof Paralelo, string]> = [
  ["grado", "Grado"],
  ["letra", "Paralelo"],
];

export default function ParalelosTable({ paralelos, grados, sortKey, asc, onToggleSort, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return paralelos;
    return paralelos.filter(p => {
      const grado = grados.find(g => 
        typeof p.grado === "object" && p.grado !== null
          ? g.id === p.grado.id
          : g.id === p.grado
      );
      console.log(grados)
      return p.letra.toLowerCase().includes(t) || grado?.nivel_educativo.toLowerCase().includes(t);
    });
  }, [search, paralelos, grados]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    }),
    [filtered, sortKey, asc]
  );
  
  console.log(grados)
  console.log(paralelos)


  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar paralelo o grado..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table> 
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {colsP.map(([key, label]) => {
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
              <td colSpan={colsP.length + 1} className="p-8 text-center">Sin paralelos</td>
            </tr>
          ) : (
            sorted.map(p => {
              const grado = grados.find(g => 
                typeof p.grado === "object" && p.grado !== null
                  ? g.id === p.grado.id
                  : g.id === p.grado
              );
              return (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{grado?.nombre ?? "–"}</td>
                  <td className="px-4 py-3">{p.letra}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(p)} className="mr-2 text-blue-600 hover:underline">
                      <Pencil className="w-4 h-4" />
                      
                    </button>
                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">
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