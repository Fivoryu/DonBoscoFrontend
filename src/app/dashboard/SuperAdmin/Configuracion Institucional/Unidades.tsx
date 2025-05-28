import { useState, useEffect } from 'react';
import AxiosInstance from '@/components/AxiosInstance';

import { Colegio, UnidadEducativa } from '@/app/modelos/Institucion';

import UnidadFormModal from './components/UnidadFormModal';
import UnidadesTable from './components/UnidadesTable';

export default function SuperAdminUnidades() {
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof UnidadEducativa>("nombre")
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUnidad, setEditUnidad] = useState<UnidadEducativa | null>(null);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get<UnidadEducativa[]>("institucion/unidades-educativas/listar"),
      AxiosInstance.get<Colegio[]>("institucion/colegios/listar"),
    ])
    .then(([resU, resC]) => {
      setUnidades(resU.data);
      setColegios(resC.data);
    })
    .catch(() => setError("No se pudieron cargar los datos."))
    .finally(() => setLoading(false));
  }, [])

  const toggleSort = (key: string) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key as keyof UnidadEducativa);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar Unidad Educativa?")) return;
    try {
      await AxiosInstance.delete(`/institucion/unidades-educativas/${id}/eliminar/`);
      setUnidades(prev => prev.filter(t => t.id !== id));
    } catch {
      alert("Error al eliminar unidad educativa.");
    }
  };

  const handleEdit = (u: UnidadEducativa | null) => { setEditUnidad(u); setModalOpen(true); };

  const handleSave = (updated: UnidadEducativa) => {
    if (editUnidad) setUnidades(prev => prev.map(u => u.id === updated.id ? updated : u));
    else setUnidades(prev => [...prev, updated]);
    setModalOpen(false);
    setEditUnidad(null);
  }

  return (
    <section className="p-6 space-y-4">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Unidades Educativas</h1>
            <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Nuevo
            </button>
          </header>
          {loading && <div className="text-center">Cargando...</div>}
          {error && <div className="text-red-600 text-center">{error}</div>}
          {!loading && !error && (
            <UnidadesTable
              unidades={unidades}
              sortKey={sortKey}
              asc={asc}
              onToggleSort={toggleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {modalOpen && (
            <UnidadFormModal
            initial={editUnidad}
            colegios={colegios}
            onCancel={() => { setModalOpen(false); setEditUnidad(null) }}
            onSave={handleSave}
            />
          )}
          
        </section>
  );
}
