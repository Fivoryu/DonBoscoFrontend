import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash, Eye } from "lucide-react";
import Table from "@/components/Table";
import { Tutor, TutorEstudiante } from "@/app/modelos/Estudiantes";

export interface Row {
  id: number;
  foto?: string | null;
  nombreCompleto: string;
  ci: string;
  email: string;
  sexo: string;
  parentesco: string;
  estudiantes: string;
  fechaAsig: string;
}

interface Props {
  tutores: Tutor[];
  relaciones: TutorEstudiante[];
  sortKey: keyof Row;
  asc: boolean;
  onToggleSort: (k: keyof Row) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onVerRelaciones: (tutorId: number) => void;
}

const cols: Array<[keyof Row, string]> = [
  ["foto", "Foto"],
  ["nombreCompleto", "Nombre"],
  ["ci", "CI"],
  ["email", "Email"],
  ["sexo", "Sexo"],
  ["parentesco", "Parentesco"],
  ["estudiantes", "Estudiantes"],
  ["fechaAsig", "Asignación"]
];

export default function TutorTable({
  tutores,
  relaciones,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
  onVerRelaciones
}: Props) {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() =>
    tutores.map(t => {
      const rels = relaciones.filter(r => r.tutor.usuario.id === t.usuario.id);
      const estudiantes = rels.map(r => `${r.estudiante.usuario.nombre} ${r.estudiante.usuario.apellido}`);
      const fechas = rels.map(r => r.fecha_asignacion?.slice(0, 10));
      return {
        id: t.usuario.id,
        foto: t.usuario.foto,
        nombreCompleto: `${t.usuario.nombre} ${t.usuario.apellido}`,
        ci: t.usuario.ci,
        email: t.usuario.email,
        sexo: t.usuario.sexo,
        parentesco: t.parentesco_display,
        estudiantes: estudiantes.length ? estudiantes.join(", ") : "–",
        fechaAsig: fechas.length ? fechas.join(", ") : "–"
      };
    }),
    [tutores, relaciones]
  );

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>
      r.nombreCompleto.toLowerCase().includes(t) ||
      r.ci.toLowerCase().includes(t) ||
      r.email.toLowerCase().includes(t) ||
      r.estudiantes.toLowerCase().includes(t)
    );
  }, [search, rows]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] ?? "";
      const B = b[sortKey] ?? "";
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
          placeholder="Buscar tutores..."
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
                Sin tutores
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
                <td className="px-4 py-3">{r.nombreCompleto}</td>
                <td className="px-4 py-3">{r.ci}</td>
                <td className="px-4 py-3">
                  <div className="truncate max-w-xs" title={r.email}>{r.email}</div>
                </td>
                <td className="px-4 py-3">{r.sexo}</td>
                <td className="px-4 py-3">{r.parentesco}</td>
                <td className="px-4 py-3">
                  <div className="truncate max-w-xs" title={r.estudiantes}>{r.estudiantes}</div>
                </td>
                <td className="px-4 py-3">{r.fechaAsig}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(r.id)} className="mr-2 text-blue-600 hover:underline">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(r.id)} className="mr-2 text-red-600 hover:underline">
                    <Trash className="w-4 h-4" />
                  </button>
                  <button onClick={() => onVerRelaciones(r.id)} className="text-gray-600 hover:underline">
                    <Eye className="w-4 h-4" />
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
