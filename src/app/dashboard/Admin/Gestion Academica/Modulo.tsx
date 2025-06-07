import AxiosInstance from "../../../../components/AxiosInstance";
import { useAuth } from "@/app/contexts/AuthContext";

import ModulosTable from "./components/ModuloTable";
import ModuloFormModal from "./components/ModulosFormModal";
import { Modulo } from "@/app/modelos/Institucion";
import { Admin } from "@/app/modelos/Usuarios";
import { useState, useEffect } from "react";

export default function AdminModulos() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Modulo | 'aulasOcupadas'>("nombre");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModulo, setEditModulo] = useState<Modulo | null>(null);
  const { user, permisosPuesto } = useAuth();
  const [admin, setAdmin] = useState<Admin | null>(null);

   useEffect(() => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<Modulo[]>("/institucion/modulos/listar/")
    ])
      .then(([resM]) => {
        setModulos(
          resM.data.map((m: any) => ({
            id: m.id,
            nombre: m.nombre,
            descripcion: m.descripcion,
            pisos: m.pisos,
            cantidadAulas: m.cantidad_aulas,
            aulasOcupadas: m.aulas_ocupadas,
            aulasDisponibles: m.aulas_disponibles,
            colegioId: m.colegio?.id ?? null,
            colegio: m.colegio
          }))
        );
      })
      .catch(() => setError("No se pudieron cargar colegios o módulos."))
      .finally(() => setLoading(false));
  }, []);


   useEffect(() => {
    if (user?.id) {
      AxiosInstance.get<Admin>(`/user/auth/admins/${user.id}/`)
        .then(res => setAdmin(res.data))
        .catch(() => setAdmin(null));
    }
  }, [user]);

  const puedeCrear = permisosPuesto.some(
    p => p.modelo.nombre === "modulo" && (p.accion.nombre === "add" || p.accion.nombre === "crear")
  );
  const puedeEditar = permisosPuesto.some(
    p => p.modelo.nombre === "modulo" && (p.accion.nombre === "change" || p.accion.nombre === "editar")
  );
  const puedeEliminar = permisosPuesto.some(
    p => p.modelo.nombre === "modulo" && (p.accion.nombre === "delete" || p.accion.nombre === "eliminar")
  );


  const toggleSort = (key: keyof Modulo) => key === sortKey ? setAsc(!asc) : (setSortKey(key), setAsc(true));
  const handleDelete = async (id: number) => {
    if (!puedeEliminar) return;
    if (!confirm('¿Eliminar este módulo?')) return;
    try { await AxiosInstance.delete(`/institucion/modulos/${id}/eliminar/`); setModulos(prev => prev.filter(m => m.id !== id)); }
    catch { alert('Error al eliminar módulo.'); }
  };
  const handleEdit = (m: Modulo | null) => {
    if (!puedeEditar && m) return;
    setEditModulo(m);
    setModalOpen(true);
  };
  const handleSave = (raw: any) => {
    // aquí convierto snake_case → camelCase
    const updated: Modulo = {
      id: raw.id,
      nombre: raw.nombre,
      descripcion: raw.descripcion,
      pisos: raw.pisos,
      cantidadAulas: raw.cantidad_aulas,
      aulasOcupadas: raw.aulas_ocupadas,
      aulasDisponibles: raw.aulas_disponibles,
      colegioId: raw.colegioId,       // o raw.colegio.id si así lo tienes
    };

    if (editModulo) {
      setModulos(prev => prev.map(m => m.id === updated.id ? updated : m));
    } else {
      setModulos(prev => [...prev, updated]);
    }
    setModalOpen(false);
    setEditModulo(null);
  };

  return (
    <section className="p-6 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl font-bold text-blue-600">Módulos</h1>
        {admin?.unidad?.colegio?.nombre && (
          <div className="text-sm text-gray-500 mt-1">
            Colegio asignado: <span className="font-semibold">{admin.unidad.colegio.nombre}</span>
          </div>
        )}
        {puedeCrear && (
          <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Nuevo</button>
        )}
      </header>
      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <ModulosTable
          modulos={modulos}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={puedeEditar ? handleEdit : undefined}
          onDelete={puedeEliminar ? handleDelete : undefined}
        />
      )}
      {modalOpen && (
        <ModuloFormModal
          initial={editModulo}
          admin={admin}
          onCancel={() => {
            setModalOpen(false);
            setEditModulo(null);
          }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}