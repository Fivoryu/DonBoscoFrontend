import AxiosInstance from "../../../../components/AxiosInstance";

import ModulosTable from "./components/ModulosTable";
import ModuloFormModal from "./components/ModulosFormModal";
import { Modulo } from "@/app/modelos/Institucion";
import { Colegio } from "@/app/modelos/Institucion";
import { useState, useEffect } from "react";

export default function SuperAdminModulos() {
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Modulo | 'aulasOcupadas'>("nombre");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModulo, setEditModulo] = useState<Modulo | null>(null);

   useEffect(() => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<Colegio[]>("/institucion/colegios/listar/"),
      AxiosInstance.get<Modulo[]>("/institucion/modulos/listar/")
    ])
      .then(([resC, resM]) => {
        setColegios(
          resC.data.map((c: any) => ({
            id: c.id,
            nombre: c.nombre,
            logo: c.logo,
            direccion: c.direccion,
            telefono: c.telefono,
            email: c.email,
            sitio_web: c.sitio_web,
            superAdminFk: c.super_admin_fk
          }))
        );
        setModulos(
          resM.data.map((m: any) => ({
            id: m.id,
            nombre: m.nombre,
            descripcion: m.descripcion,
            pisos: m.pisos,
            cantidadAulas: m.cantidad_aulas,
            aulasOcupadas: m.aulas_ocupadas,
            aulasDisponibles: m.aulas_disponibles,
            colegioId: m.colegio?.id ?? null
          }))
        );
      })
      .catch(() => setError("No se pudieron cargar colegios o módulos."))
      .finally(() => setLoading(false));
  }, []);

  console.log(modulos)
  console.log(colegios)

  const toggleSort = (key: keyof Modulo) => key === sortKey ? setAsc(!asc) : (setSortKey(key), setAsc(true));
  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este módulo?')) return;
    try { await AxiosInstance.delete(`/institucion/modulos/eliminar/${id}/`); setModulos(prev => prev.filter(m => m.id !== id)); }
    catch { alert('Error al eliminar módulo.'); }
  };
  const handleEdit = (m: Modulo | null) => { setEditModulo(m); setModalOpen(true); };
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
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Módulos</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Nuevo</button>
      </header>
      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <ModulosTable modulos={modulos} colegios={colegios} sortKey={sortKey} asc={asc} onToggleSort={toggleSort} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {modalOpen && (
        <ModuloFormModal
          initial={editModulo}
          colegios={colegios}
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