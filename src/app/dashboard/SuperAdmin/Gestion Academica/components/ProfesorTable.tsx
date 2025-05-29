import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import Table from "@/components/Table";
import { Profesor, ProfesorEspecialidad } from "@/app/modelos/Personal";

interface Props {
  profesores: Profesor[];
  profesorEspecialidades: ProfesorEspecialidad[];
  sortKey: keyof Row;
  asc: boolean;
  onToggleSort: (k: keyof Row) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export type Row = {
  id: number;
  ci: string;
  foto?: string | null;
  nombreCompleto: string;
  sexo: string;
  email: string;
  fechaNac: string;
  username: string;
  especialidades: string; 
  fechaAsig: string;       
};

const cols: Array<[keyof Row, string]> = [
  ["foto", "Foto"],
  ["ci", "CI"],
  ["nombreCompleto", "Nombre"],
  ["sexo", "Sexo"],
  ["email", "Email"],
  ["fechaNac", "Nacimiento"],
  ["username", "Usuario"],
  ["especialidades", "Especialidades"],
  ["fechaAsig", "Asignación"],
];

export default function ProfesorTable({
  profesores,
  profesorEspecialidades,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() =>
    profesores.map(p => {
      const peList = profesorEspecialidades.filter(
        pe => pe.profesor.usuario.id === p.usuario.id
      );
      const nombres = peList.map(pe => pe.especialidad.nombre);
      const fechas = peList.map(pe => pe.fecha_asignacion.slice(0,10));
      return {
        id:             p.usuario.id,
        foto:           p.usuario.foto,
        ci:             p.usuario.ci,
        nombreCompleto: `${p.usuario.nombre} ${p.usuario.apellido}`,
        sexo:           p.usuario.sexo,
        email:          p.usuario.email,
        fechaNac:       p.usuario.fecha_nacimiento?.slice(0,10) ?? "–",
        username:       p.usuario.username,
        especialidades: nombres.length > 0 ? nombres.join(", ") : "–",
        fechaAsig:      fechas.length > 0 ? fechas.join(", ") : "–",
      };
    }),
  [profesores, profesorEspecialidades]
  );

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>
      r.nombreCompleto.toLowerCase().includes(t) ||
      r.username.toLowerCase().includes(t) ||
      r.especialidades.toLowerCase().includes(t)
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
          placeholder="Buscar profesores..."
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
                Sin profesores
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
                <td className="px-4 py-3 whitespace-nowrap">{r.nombreCompleto}</td>
                <td className="px-4 py-3">{r.ci}</td>
                <td className="px-4 py-3">{r.sexo}</td>
                <td className="px-4 py-3">
                  <div className="truncate max-w-xs" title={r.email}>
                    {r.email}
                  </div>  
                </td>
                <td className="px-4 py-3">{r.fechaNac}</td>
                <td className="px-4 py-3">{r.username}</td>
                <td className="px-4 py-3">
                  <div className="truncate max-w-xs" title={r.especialidades}>
                    {r.especialidades || "–"}
                  </div>
                </td>
                <td className="px-4 py-3">{r.fechaAsig}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(r.id)} className="mr-2 text-blue-600 hover:underline">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(r.id)} className="text-red-600 hover:underline">
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
