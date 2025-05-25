import AxiosInstance from "../../../components/AxiosInstance";
import CursosTable from "./components/CursosTable";
import CursoFormModal from "./components/CursoFormModal";
import { Curso, Paralelo } from "@/app/modelos/Academico";
import { useState, useEffect } from "react";



export default function SuperAdminCursos() {
  const [paralelos, setParalelos] = useState<Paralelo[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Curso>("paraleloId");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCurso, setEditCurso] = useState<Curso | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<Paralelo[]>("/academico/paralelos/listar/"),
      AxiosInstance.get<Curso[]>("/academico/cursos/listar/")
    ])
    .then(([resP, resC]) => {
      setParalelos(resP.data.map((p: any) => ({
        id: p.id,
        grado: p.grado_fk,
        letra: p.letra
      })));
      setCursos(resC.data.map((c: any) => ({
        paraleloId: c.paralelo,
        nombre: c.nombre,
        unidadEducativa: c.unidad_educativa,
        unidadEducativaNombre: c.unidad_educativa_nombre
      })));
    })
    .catch(() => setError("No se pudieron cargar paralelos o cursos."))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Curso) => key === sortKey ? setAsc(!asc) : (setSortKey(key), setAsc(true));

  const handleDelete = async (parId: number) => {
    if (!confirm("¿Eliminar este curso?")) return;
    try {
      await AxiosInstance.delete(`/academico/cursos/eliminar/${parId}/`);
      setCursos(prev => prev.filter(c => c.paraleloId !== parId));
    } catch {
      alert("Error al eliminar curso.");
    }
  };

  const handleEdit = (c: Curso | null) => { setEditCurso(c); setModalOpen(true); };

  const handleSave = (updated: Curso) => {
    if (editCurso) setCursos(prev => prev.map(c => c.paraleloId === updated.paraleloId ? updated : c));
    else setCursos(prev => [...prev, updated]);
    setModalOpen(false);
    setEditCurso(null);
  };

  console.log("cursos", cursos);
  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Cursos</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <CursosTable
          cursos={cursos}
          paralelos={paralelos}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <CursoFormModal
          initial={editCurso}
          paralelos={paralelos}
          onCancel={() => { setModalOpen(false); setEditCurso(null); }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}