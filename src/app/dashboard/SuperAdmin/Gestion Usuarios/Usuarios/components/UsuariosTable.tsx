import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, Mars, Venus } from "lucide-react";
import { Usuario } from "@/app/modelos/Usuarios";
import UsuarioActions from "./UsuarioActions";
import Table from "@/components/Table";

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
  const [search, setSearch] = useState("");
  const [ctxOpen, setCtxOpen] = useState(false);
  const [ctxPos, setCtxPos] = useState({ x: 0, y: 0 });
  const [ctxUser, setCtxUser] = useState<Usuario | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    // Filtrar usuarios vacíos o incompletos
    const validUsers = usuarios.filter(u => u && u.ci && u.nombre && u.apellido);
    if (!term) return validUsers;
    return validUsers.filter(u =>
      u.ci.toLowerCase().includes(term) ||
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term)
    );
  }, [search, usuarios]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      if (A === B) return 0;
      return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setCtxOpen(false);
      }
    };
    if (ctxOpen) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [ctxOpen]);

  const handleContextMenu = (e: React.MouseEvent, u: Usuario) => {
    e.preventDefault();
    setCtxUser(u);
    setCtxPos({ x: e.clientX, y: e.clientY });
    setCtxOpen(true);
  };

  const goToBitacora = () => {
    if (!ctxUser) return;
    navigate(`/dashboard/superadmin/bitacora/${ctxUser.id}/usuario/`);
    setCtxOpen(false);
  };

  return (
    <div className="max-w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por CI, nombre o apellido..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Table className="border-gray-200">
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {columnas.map(([key, label]) => {
              const active = sortKey === key;
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
                  className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active && (asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </span>
                </th>
              );
            })}
            <th className="px-4 py-3 text-right whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columnas.length + 1} className="p-8 text-center text-gray-500">
                Sin usuarios
              </td>
            </tr>
          ) : (
            sorted.map(u => (
              <tr key={u.id} onContextMenu={e => handleContextMenu(e, u)} className="hover:bg-blue-50">
                <td className="px-4 py-3 whitespace-nowrap">{u.ci}</td>
                <td className="px-4 py-3 whitespace-nowrap">{u.nombre}</td>
                <td className="px-4 py-3 whitespace-nowrap">{u.apellido}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {u.sexo?.toUpperCase() === "M" ? <Mars className="w-5 h-5 text-blue-600" /> : u.sexo?.toUpperCase() === "F" ? <Venus className="w-5 h-5 text-pink-600" /> : <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">N/A</div>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{u.rol?.nombre ?? "Sin rol"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{u.username}</td>
                <td className="px-4 py-3 whitespace-nowrap">{u.fecha_nacimiento?.slice(0, 10)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {u.foto ? <img src={u.foto as string} alt="perfil" className="w-8 h-8 rounded-full" /> : <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">N/A</div>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <UsuarioActions user={u} onEdit={() => onEdit(u)} onDelete={() => onDelete(u.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {ctxOpen && (
        <div
          ref={menuRef}
          style={{ top: ctxPos.y, left: ctxPos.x }}
          className="fixed bg-white border rounded shadow-md z-50"
        >
          <button onClick={goToBitacora} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">
            Ver Bitácora
          </button>
        </div>
      )}
    </div>
  );
}
