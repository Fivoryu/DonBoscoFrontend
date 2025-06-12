/* src/app/dashboard/SuperAdmin/Planificacion Academica/clases.tsx */

import { useEffect, useState } from "react";
import Axios from "@/components/AxiosInstance";
import { Clase } from "@/app/modelos/Academico";

import ClaseTable, { RowKey } from "./components/classTable";
import ClaseFormModal from "./components/ClaseFormModal";

/* ─────────────── Componente principal ─────────────── */
export default function SuperAdminClase() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ordenamiento */
  const [sortKey, setSortKey] = useState<RowKey>("colegio");
  const [asc, setAsc] = useState(true);

  /* modal */
  const [modalOpen, setModalOpen] = useState(false);
  const [editClase, setEditClase] = useState<Clase | null>(null);

  /* ---------- carga inicial ---------- */
  useEffect(() => {
    Axios.get<Clase[]>("/academico/clases/listar/")
      .then((r) => setClases(r.data))
      .catch(() => setError("No se pudieron cargar las clases."))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- helpers ---------- */
  const toggleSort = (k: RowKey) => {
    if (k === sortKey) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta clase?")) return;
    try {
      await Axios.delete(`/academico/clases/${id}/eliminar/`);
      setClases((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Error al eliminar clase.");
    }
  };

  const handleEdit = (c: Clase | null) => {
    setEditClase(c);
    setModalOpen(true);
  };

  const handleSave = (c: Clase) => {
    setClases((prev) => {
      if (editClase) return prev.map((x) => (x.id === c.id ? c : x));
      return [...prev, c];
    });
    setModalOpen(false);
    setEditClase(null);
  };

  /* ---------- render ---------- */
  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Clases</h1>
        <button
          onClick={() => handleEdit(null)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva
        </button>
      </header>

      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && !error && (
        <ClaseTable
          clases={clases}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <ClaseFormModal
          initial={editClase}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditClase(null);
          }}
        />
      )}
    </section>
  );
}
