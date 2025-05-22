import { ChevronUp, ChevronDown, Mars, Venus } from "lucide-react";
import { Usuario } from "@/app/modelos/Usuarios";
import UsuarioActions from "./UsuarioActions";
import { useMemo, useState } from "react";

interface Props {
  usuarios: Usuario[];
  sortKey: keyof Usuario;
  asc: boolean;
  onToggleSort: (key: keyof Usuario) => void;
  onEdit: (u: Usuario) => void;
  onDelete: (id: number) => void;
}

const columnas: Array<[keyof Usuario, string]> = [
  ["ci", "CI"],
  ["nombre", "Nombre"],
  ["apellido", "Apellido"],
  ["sexo", "Sexo"],
  ["email", "Email"],
  ["rol", "Rol"],
  ["username", "Usuario"],
  ["fecha_nacimiento", "Nacimiento"],
  ["foto", "Foto"],
];

export default function UsuariosTable({
  usuarios,
  sortKey,
  asc,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState<string>("");

  // Filtra usuarios por nombre o apellido o ci
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return usuarios;
    return usuarios.filter(u =>
      u.ci.toLowerCase().includes(term) || 
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term)
    )
  }, [search, usuarios])

  // orden
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
    });
  }, [filtered, sortKey, asc]);

  return (
    <div className="max-w-full overflow-x-auto bg-white rounded-x5 shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por CI, nombre o apellido..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
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
                      {active &&
                        (asc ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
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
                <td
                  colSpan={columnas.length + 1}
                  className="p-8 text-center text-gray-500"
                >
                  Sin usuarios
                </td>
              </tr>
            ) : (
              sorted.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{u.ci}</td>
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{u.apellido}</td>
                  <td className="px-4 py-3 text-center">
                    {u.sexo?.toUpperCase() === "M" ? (
                      <Mars className="w-5 h-5 text-blue-600" />
                    ) : u.sexo?.toUpperCase() === "F" ? (
                      <Venus className="w-5 h-5 text-pink-600" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.rol.nombre}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">
                    {u.fecha_nacimiento?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    {u.foto ? (
                      <img
                        src={u.foto as string}
                        alt="perfil"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <UsuarioActions
                      user={u}
                      onEdit={() => onEdit(u)}
                      onDelete={() => onDelete(u.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
