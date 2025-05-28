import { Materia } from "@/app/modelos/Academico";
import AxiosInstance from "@/components/AxiosInstance";
import { useState, useEffect } from "react";
import MateriaTable from "./components/MateriaTable";
import MateriaFormModal from "./components/MateriaFormModal";


export default function SuperAdminMateria() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Materia>("id");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMateria, setEditMateria] = useState<Materia | null>(null);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get<Materia[]>("/academico/materias/listar/"),
    ])
    .then(([resM]) => {
      setMaterias(resM.data);
    })
    .catch(() => setError("No se pudieron cargar los datos."))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: string) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key as keyof Materia);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este horario?")) return;
    try {
      await AxiosInstance.delete(`/academico/materias/${id}/eliminar/`);
      setMaterias(prev => prev.filter(m => m.id !== id));
    } catch {
      alert("Error al eliminar tipo de horario.");
    }
  };

  const handleEdit = (h: Materia | null) => { setEditMateria(h); setModalOpen(true); };

  const handleSave = (updated: Materia) => {
    if (editMateria) setMaterias(prev => prev.map(m => m.id === updated.id ? updated : m));
    else setMaterias(prev => [...prev, updated]);
    setModalOpen(false);
    setEditMateria(null);
  }

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Materias</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <MateriaTable
          materias={materias}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <MateriaFormModal
          initial={editMateria}
          onSave={handleSave}
          onCancel={() => {setModalOpen(false); setEditMateria(null); }}
        />
      )}
      
    </section>
  );
}