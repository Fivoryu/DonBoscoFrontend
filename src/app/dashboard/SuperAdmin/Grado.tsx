import { Plus} from "lucide-react";
import AxiosInstance from "../../../components/AxiosInstance";
import GradosTable from "./components/GradoTable";
import GradoFormModal from "./components/GradoForm";
import { Grado } from "@/app/modelos/Academico";
import { UnidadEducativa } from "@/app/modelos/Institucion";
import { useState, useEffect } from "react";

export default function AcademicoGrados() {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Grado>("nivelEducativo");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGrado, setEditGrado] = useState<Grado | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<Grado[]>('/academico/listar-grados/'),
      AxiosInstance.get<UnidadEducativa[]>('/institucion/unidades-educativas/listar/')
    ])
    .then(([resG, resU]) => {
      setGrados(resG.data.map(g => ({
        id: g.id,
        nivelEducativo: g.nivelEducativo,
        unidadEducativaId: g.unidadEducativaId
      })));
      setUnidades(resU.data);
    })
    .catch(() => setError('No se pudieron cargar grados o unidades.'))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Grado) => {
    if (key === sortKey) setAsc(!asc);
    else { setSortKey(key); setAsc(true); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este grado?')) return;
    try {
      await AxiosInstance.delete(`/academico/eliminar-grado/${id}/`);
      setGrados(prev => prev.filter(g => g.id !== id));
    } catch {
      alert('Error al eliminar grado.');
    }
  };

  const handleEdit = (g: Grado | null) => {
    setEditGrado(g);
    setModalOpen(true);
  };

  const handleSave = (updated: Grado) => {
    if (editGrado) {
      setGrados(prev => prev.map(g => g.id === updated.id ? updated : g));
    } else {
      setGrados(prev => [...prev, updated]);
    }
    setModalOpen(false);
    setEditGrado(null);
  };

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Grados</h1>
        <button
          onClick={() => handleEdit(null)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Nuevo
        </button>
      </header>

      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && !error && (
        <GradosTable
          grados={grados}
          unidades={unidades}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <GradoFormModal
          initial={editGrado}
          unidades={unidades}
          onCancel={() => { setModalOpen(false); setEditGrado(null); }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}