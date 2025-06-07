import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { UnidadEducativa } from "@/app/modelos/Institucion";
import { useMemo, useState } from "react";
import Table from "@/components/Table";

interface Props {
  unidades: UnidadEducativa[];
  sortKey: keyof UnidadEducativa;
  asc: boolean;
  onToggleSort: (k: keyof UnidadEducativa | string) => void;
  onEdit: (h: UnidadEducativa) => void;
  onDelete: (id: number) => void;
}

const colsH: Array<[keyof UnidadEducativa, string]> =[
  ["nombre", "Nombre"],
  ["codigo_sie", "Codigo SIE"],
  ["turno", "Turno"],
  ["colegio", "Colegio"],
  ["direccion", "Direccion"],
  ["nivel", "Nivel"],
  ["telefono", "Telefono"],
]

export default function UnidadesTable({
  unidades,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete
} : Props) {
  const [search, setSearch] = useState("");
  
    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      if (!term) return unidades;
      return unidades.filter((u) => {
        if (u.nombre?.toLowerCase().includes(term)) return true;
        if (u.codigo_sie?.toLowerCase().includes(term)) return true;
        if (u.turno?.toLowerCase().includes(term)) return true;
        if (u.colegio?.nombre.toLowerCase().includes(term)) return true;
        if (u.direccion?.toLowerCase().includes(term)) return true;
        if (u.nivel?.toLowerCase().includes(term)) return true;
        if (u.telefono?.toLowerCase().includes(term)) return true;

        return false;
      })
    }, [search, unidades]);
    const sorted = useMemo(() => {
    return [... filtered].sort((a, b) => {
      let valA: any = (a as any)[sortKey];
      let valB: any = (b as any)[sortKey];
      if (valA == null && valB == null) return 0;
      if (valA == null) return asc ? -1 : 1;
      if (valB == null) return asc ? 1 : -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return asc ? valA -valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA === strB) return 0;
      return asc ? (strA > strB ? 1 : -1) : (strA < strB ? 1 : -1);
    })
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Buscar Unidades Educativas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <Table>
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {colsH.map(([key, label]) => {
              const isActive = sortKey === key;
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
                  className="px-4 py-3 cursor-pointer whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {isActive && (asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
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
              <td colSpan={colsH.length + 1} className="p-8 text-center text-gray-500">Sin Unidades Educativas</td>
            </tr>
          ): (
            sorted.map(u => {
              return (
                <tr key={u.id} className="hover:bg-blue-50 text-center">
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{u.codigo_sie}</td>
                  <td className="px-4 py-3">{u.turno}</td>
                  <td className="px-4 py-3">{u.colegio?.nombre}</td>
                  <td className="px-4 py-3">{u.direccion}</td>
                  <td className="px-4 py-3">{u.nivel}</td>
                  <td className="px-4 py-3">{u.telefono}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(u)} className="mr-2 text-blue-600 hover:underline">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(u.id)} className="text-red-600 hover:underline">
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
  )
}