import AxiosInstance from "../../../components/AxiosInstance";

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
  const [sortKey, setSortKey] = useState<keyof Modulo>("nombre");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModulo, setEditModulo] = useState<Modulo | null>(null);

   useEffect(() => {
    setLoading(true);
    // Fetch colegios and modulos in parallel
    Promise.all([
      AxiosInstance.get<Colegio[]>('/institucion/colegios/listar/'),
      AxiosInstance.get<Modulo[]>('/institucion/modulos/listar/')
    ])
      .then(([resC, resM]) => {
        setColegios(resC.data.map((c: any) => ({ id: c.id, nombre: c.nombre, logo: c.logo, direccion: c.direccion, telefono: c.telefono, email: c.email, sitio_web: c.sitio_web, superAdminFk: c.superadmin_fk })));
        setModulos(resM.data.map((m: any) => ({ id: m.id, nombre: m.nombre, descripcion: m.descripcion, cantidadAulas: m.cantidad_aulas, colegioId: m.colegio_fk })));
      })
      .catch(() => setError('No se pudieron cargar colegios o módulos.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Modulo) => key === sortKey ? setAsc(!asc) : (setSortKey(key), setAsc(true));
  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este módulo?')) return;
    try { await AxiosInstance.delete(`/institucion/modulos/eliminar/${id}/`); setModulos(prev => prev.filter(m => m.id !== id)); }
    catch { alert('Error al eliminar módulo.'); }
  };
  const handleEdit = (m: Modulo | null) => { setEditModulo(m); setModalOpen(true); };
  const handleSave = (updated: Modulo) => {
    if (editModulo) setModulos(prev => prev.map(m => m.id === updated.id ? updated : m));
    else setModulos(prev => [...prev, updated]);
    setModalOpen(false); setEditModulo(null);
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
        <ModuloFormModal initial={editModulo} onCancel={() => (setModalOpen(false), setEditModulo(null))} onSave={handleSave} />
      )}
    </section>
  );
}