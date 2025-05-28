import AxiosInstance from "@/components/AxiosInstance";
import { TipoHorario } from "@/app/modelos/Calendario";
import { useState, useEffect } from "react";
import TipoHorarioTable from "./components/TipoHorarioTable";
import TipoHorarioFormModal from "./components/TipoHorarioFormModal";

export default function SuperAdminTipoHorario() {
  const [tipoHorario, setTipoHorario] = useState<TipoHorario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof TipoHorario>("nombre");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTipoHorario, setEditTipoHorario] = useState<TipoHorario | null>(null);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get<TipoHorario[]>("/calendario/tipos-horario/listar/")
    ])
    .then(([res]) => {
      setTipoHorario(res.data);
    })
    .catch(() => setError("No se pudieron cargar los datos."))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: string) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key as keyof TipoHorario);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este tipo de horario?")) return;
    try {
      await AxiosInstance.delete(`/calendarios/tipos-horario/${id}/eliminar/`);
      setTipoHorario(prev => prev.filter(t => t.id !== id));
    } catch {
      alert("Error al eliminar tipo de horario.");
    }
  };

  const handleEdit = (t: TipoHorario | null) => { setEditTipoHorario(t); setModalOpen(true); };

  const handleSave = (updated: TipoHorario) => {
    if (editTipoHorario) setTipoHorario(prev => prev.map(t => t.id === updated.id ? updated : t));
    else setTipoHorario(prev => [...prev, updated]);
    setModalOpen(false);
    setEditTipoHorario(null);
  }

  console.log(tipoHorario);

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Tipos de Horarios</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <TipoHorarioTable
          tiposHorario={tipoHorario}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <TipoHorarioFormModal
          initial={editTipoHorario}
          onSave={handleSave}
          onCancel={() => {setModalOpen(false); setEditTipoHorario(null); }}
        />
      )}
      
    </section>
  );

}