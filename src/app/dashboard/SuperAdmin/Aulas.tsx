import AxiosInstance from "../../../components/AxiosInstance";
import AulasTable from "./components/AulasTable";
import AulaFormModal from "./components/AulasFormModal";
import { Aula, Modulo } from "@/app/modelos/Institucion";
import { useState, useEffect } from "react";

export default function SuperAdminAulas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<keyof Aula>("nombre");
  const [asc, setAsc] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editAula, setEditAula] = useState<Aula | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<Modulo[]>('/institucion/modulos/listar/'),
      AxiosInstance.get<Aula[]>('/institucion/aulas/listar/')
    ]).then(([resM, resA]) => {
      setModulos(resM.data);
      setAulas(resA.data);
    })
    .catch(() => setError('No se pudieron cargar las aulas o módulos.'))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Aula) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta aula?')) return;
    try {
      await AxiosInstance.delete(`/institucion/aulas/eliminar/${id}/`);
      setAulas(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Error al eliminar aula.');
    }
  };

  const handleEdit = (a: Aula | null) => {
    setEditAula(a);
    setModalOpen(true);
  };

  const handleSave = (updated: Aula) => {
    if (editAula) {
      setAulas(prev => prev.map(a => a.id === updated.id ? updated : a));
    } else {
      setAulas(prev => [...prev, updated]);
    }
    setModalOpen(false);
    setEditAula(null);
  };

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Aulas</h1>
        <button
          onClick={() => handleEdit(null)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <AulasTable
          aulas={aulas}
          modulos={modulos}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <AulaFormModal
          initial={editAula}
          onCancel={() => { setModalOpen(false); setEditAula(null); }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}