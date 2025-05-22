import { ChevronUp, ChevronDown } from "lucide-react";
import { Aula, Modulo } from "@/app/modelos/Institucion";
import { useMemo, useState } from "react";
import { getModuloFromAula } from "../utils/getModuloFromAula";

interface Props {
  aulas: Aula[];
  modulos: Modulo[];
  sortKey: keyof Aula;
  asc: boolean;
  onToggleSort: (key: keyof Aula) => void;
  onEdit: (a: Aula) => void;
  onDelete: (id: number) => void;
}

const columnas: Array<[keyof Aula, string]> = [
  ["moduloId", "Módulo"],
  ["nombre", "Nombre"],
  ["capacidad", "Capacidad"],
  ["tipo", "Tipo"],
];

export default function AulasTable({ aulas, modulos, sortKey, asc, onToggleSort, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return aulas;
    return aulas.filter(a =>
      a.nombre.toLowerCase().includes(term) ||
      a.tipo.toLowerCase().includes(term)
    );
  }, [search, aulas]);

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
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <table className="table-auto w-full text-sm whitespace-nowrap">
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {columnas.map(([key, label]) => {
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
            <tr><td colSpan={columnas.length + 1} className="p-8 text-center">Sin aulas</td></tr>
          ) : (
            sorted.map(a => (
              <tr key={a.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{getModuloFromAula(a, modulos)?.nombre}</td>
                <td className="px-4 py-3">{a.nombre}</td>
                <td className="px-4 py-3">{a.capacidad}</td>
                <td className="px-4 py-3">{a.tipo}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(a)} className="mr-2 text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => onDelete(a.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}