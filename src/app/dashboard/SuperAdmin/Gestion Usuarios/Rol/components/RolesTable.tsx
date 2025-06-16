import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Rol } from "@/app/modelos/Usuarios";
import { useMemo, useState } from "react";

interface Props {
  roles: Rol[];
  sortKey: keyof Rol;
  asc: boolean;
  onToggleSort: (key: keyof Rol) => void;
  onEdit: (r: Rol) => void;
  onDelete: (id: number) => void;
  onPermisos: (r: Rol) => void; // <-- nuevo prop
}

const columnas: Array<[keyof Rol, string]> = [
  ["id", "ID"],
  ["nombre", "Nombre"],
  ["descripcion", "Descripción"],
];

export default function RolesTable({ roles, sortKey, asc, onToggleSort, onEdit, onDelete, onPermisos }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return roles;
    return roles.filter(r =>
      r.nombre.toLowerCase().includes(term) ||
      (r.descripcion?.toLowerCase() || '').includes(term)
    );
  }, [search, roles]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="max-w-full overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <table className="table-auto min-w-full text-sm whitespace-nowrap">
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
            <tr>
              <td colSpan={columnas.length + 1} className="p-8 text-center text-gray-500">
                Sin roles
              </td>
            </tr>
          ) : (
            sorted.map(r => (
              <tr key={r.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{r.id}</td>
                <td className="px-4 py-3">{r.nombre}</td>
                <td className="px-4 py-3">{r.descripcion || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(r)} className="mr-2 text-blue-600 hover:underline">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(r.id)} className="mr-2 text-red-600 hover:underline">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onPermisos(r)} className="text-green-600 hover:underline">
                    Permisos
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}