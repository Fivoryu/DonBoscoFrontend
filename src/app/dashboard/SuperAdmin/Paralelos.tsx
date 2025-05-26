import AxiosInstance from "../../../components/AxiosInstance";
import ParalelosTable from "./components/ParalelosTable";
import ParaleloFormModal from "./components/ParaleloFormModal";
import { Paralelo, Grado } from "@/app/modelos/Academico";
import { Colegio, UnidadEducativa } from "@/app/modelos/Institucion";
import { useState, useEffect } from "react";

export default function SuperAdminParalelos() {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [paralelos, setParalelos] = useState<Paralelo[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Paralelo>("letra");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editParalelo, setEditParalelo] = useState<Paralelo | null>(null);

  useEffect(() => {
  setLoading(true);
    Promise.all([
      AxiosInstance.get<Grado[]>("/academico/grados/listar/"),
      AxiosInstance.get<Paralelo[]>("/academico/paralelos/listar/"),
      AxiosInstance.get<UnidadEducativa[]>("/institucion/unidades-educativas/listar/"),
      AxiosInstance.get<Colegio[]>("/institucion/colegios/listar/")
    ])
    .then(([resG, resP, resU, resC]) => {
      setGrados(resG.data);
      setParalelos(resP.data);
      setUnidades(resU.data);
      setColegios(resC.data);
    })
    .catch(() => setError("No se pudieron cargar los datos."))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: string) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key as keyof Paralelo);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este paralelo?")) return;
    try {
      await AxiosInstance.delete(`/academico/paralelos/${id}/eliminar/`);
      setParalelos(prev => prev.filter(p => p.id !== id));
    } catch {
      alert("Error al eliminar paralelo.");
    }
  };

  const handleEdit = (p: Paralelo | null) => { setEditParalelo(p); setModalOpen(true); };

  const handleSave = (updated: Paralelo) => {
    if (editParalelo) setParalelos(prev => prev.map(p => p.id === updated.id ? updated : p));
    else setParalelos(prev => [...prev, updated]);
    setModalOpen(false);
    setEditParalelo(null);
  };

  console.log(paralelos)

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Paralelos</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <ParalelosTable
          paralelos={paralelos}
          grados={grados}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <ParaleloFormModal
          initial={editParalelo}
          grados={grados}
          colegios={colegios}          // No olvides pasar todos los props requeridos
          unidades={unidades}
          onCancel={() => { setModalOpen(false); setEditParalelo(null); }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
