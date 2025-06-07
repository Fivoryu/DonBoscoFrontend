import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Admin } from "@/app/modelos/Usuarios";
import Table from "@/components/Table";

interface Props {
  admins: Admin[];
  sortKey: keyof Row;
  asc: boolean;
  onToggleSort: (k: keyof Row) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export type Row = {
  id: number;
  foto?: string | null;
  ci: string;
  nombreCompleto: string;
  sexo: string;
  email: string;
  fechaNac: string;
  username: string;
  puesto: string;
  unidad: string;
};

const cols: Array<[keyof Row, string]> = [
  ["foto", "Foto"],
  ["ci", "CI"],
  ["nombreCompleto", "Nombre"],
  ["sexo", "Sexo"],
  ["email", "Email"],
  ["fechaNac", "Nacimiento"],
  ["username", "Usuario"],
  ["puesto", "Puesto"],
  ["unidad", "Unidad"],
];

export default function AdminTable({
  admins,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() =>
    admins.map(a => ({
      id: a.usuario.id,
      foto: a.usuario.foto,
      ci: a.usuario.ci,
      nombreCompleto: `${a.usuario.nombre} ${a.usuario.apellido}`,
      sexo: a.usuario.sexo,
      email: a.usuario.email,
      fechaNac: a.usuario.fecha_nacimiento?.slice(0, 10) ?? "–",
      username: a.usuario.username,
      puesto: typeof a.puesto === "string" ? a.puesto : (a.puesto?.nombre ?? "–"),
      unidad: typeof a.unidad === "string" ? a.unidad : (a.unidad?.nombre ?? "–"),
    })),
    [admins]
  );

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>
      r.nombreCompleto.toLowerCase().includes(t) ||
      r.username.toLowerCase().includes(t) ||
      r.puesto.toLowerCase().includes(t)
    );
  }, [search, rows]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      if (typeof A === "string" && typeof B === "string") {
        return asc ? A.localeCompare(B) : B.localeCompare(A);
      }
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar administradores..."
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
              <td colSpan={cols.length + 1} className="p-8 text-center text-gray-500">
                Sin administradores
              </td>
            </tr>
          ) : (
            sorted.map(r => (
              <tr key={r.id} className="hover:bg-blue-50">
                <td className="px-4 py-3 text-center">
                  {r.foto ? (
                    <img src={r.foto} alt={r.nombreCompleto} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">N/A</div>
                  )}
                </td>
                <td className="px-4 py-3">{r.ci}</td>
                <td className="px-4 py-3">{r.nombreCompleto}</td>
                <td className="px-4 py-3">{r.sexo}</td>
                <td className="px-4 py-3">
                  <div className="truncate max-w-xs" title={r.email}>
                    {r.email}
                  </div>
                </td>
                <td className="px-4 py-3">{r.fechaNac}</td>
                <td className="px-4 py-3">{r.username}</td>
                <td className="px-4 py-3">{r.puesto}</td>
                <td className="px-4 py-3">{r.unidad}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(r.id)} className="mr-2 text-blue-600 hover:underline">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(r.id)} className="text-red-600 hover:underline">
                    <Trash2 className="w-4 h-4" />
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
