import AxiosInstance from "@/components/AxiosInstance";
import { TipoHorario, Horario } from "@/app/modelos/Calendario";
import { useState, useEffect } from "react";
import HorarioTable from "./components/HorarioTable";
import HorarioFormModal from "./components/HorarioFormModal";

export default function SuperAdminHorario() {
  const [horario, setHorario] = useState<Horario[]>([]);
  const [tipoHorario, setTipoHorario] = useState<TipoHorario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Horario>("id");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editHorario, setEditHorario] = useState<Horario | null>(null);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get<TipoHorario[]>("/calendario/tipos-horario/listar/"),
      AxiosInstance.get<Horario[]>("/calendario/horarios/listar/")
    ])
    .then(([resT, resH]) => {
      setTipoHorario(resT.data);
      setHorario(resH.data);
    })
    .catch(() => setError("No se pudieron cargar los datos."))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: string) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key as keyof Horario);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este horario?")) return;
    try {
      await AxiosInstance.delete(`/calendarios/horarios/${id}/eliminar/`);
      setHorario(prev => prev.filter(t => t.id !== id));
    } catch {
      alert("Error al eliminar tipo de horario.");
    }
  };

  const handleEdit = (h: Horario | null) => { setEditHorario(h); setModalOpen(true); };

  const handleSave = (updated: Horario) => {
    if (editHorario) setHorario(prev => prev.map(t => t.id === updated.id ? updated : t));
    else setHorario(prev => [...prev, updated]);
    setModalOpen(false);
    setEditHorario(null);
  }

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Horarios</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <HorarioTable
          Horarios={horario}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <HorarioFormModal
          initial={editHorario}
          tipos={tipoHorario}
          onSave={handleSave}
          onCancel={() => {setModalOpen(false); setEditHorario(null); }}
        />
      )}
      
    </section>
  );

}