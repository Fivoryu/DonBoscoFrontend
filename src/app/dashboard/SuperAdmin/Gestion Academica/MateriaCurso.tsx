import { Curso, Materia, MateriaCurso } from "@/app/modelos/Academico";
import AxiosInstance from "@/components/AxiosInstance";
import { useState, useEffect } from "react";
import MateriaCursoTable from "./components/MateriaCursoTable";
import MateriaCursoFormModal from "./components/MateriaCursoFormModal";
import { Colegio, UnidadEducativa } from "@/app/modelos/Institucion";
import { Profesor } from "@/app/modelos/Personal";

type SortableRow = {
  colegio: string;
  unidad: string;
  curso: string;
  materia: string;
};

export default function SuperAdminMateriaCurso() {
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [materiaCurso, setMateriaCurso] = useState<MateriaCurso[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof SortableRow>("colegio");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMateriaCurso, setEditMateriaCurso] = useState<MateriaCurso | null>(null);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get<Colegio[]>("institucion/colegios/listar/"),
      AxiosInstance.get<UnidadEducativa[]>("institucion/unidades-educativas/listar/"),
      AxiosInstance.get<Curso[]>("/academico/cursos/listar/"),
      AxiosInstance.get<Materia[]>("/academico/materias/listar/"),
      AxiosInstance.get<MateriaCurso[]>("/academico/materias-curso/listar-asignaciones/"), 
      AxiosInstance.get<Profesor[]>("/personal/profesores/listar")
    ])
    .then(([resC, resU, resCu, resM, resMC, resP]) => {
      setColegios(resC.data);
      setUnidades(resU.data);
      setCursos(resCu.data);
      setMaterias(resM.data);
      setMateriaCurso(resMC.data);
      setProfesores(resP.data);
    })
    .catch(() => setError("No se pudieron cargar los datos."))
    .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: string) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key as keyof SortableRow);
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

  const handleEdit = (h: MateriaCurso | null) => { setEditMateriaCurso(h); setModalOpen(true); };

  const handleSave = (updated: MateriaCurso) => {
    if (editMateriaCurso) setMateriaCurso(prev => prev.map(m => m.id === updated.id ? updated : m));
    else setMateriaCurso(prev => [...prev, updated]);
    setModalOpen(false);
    setEditMateriaCurso(null);
  }

  console.log(cursos)

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Materias Cursos</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <MateriaCursoTable
          asignaciones={materiaCurso}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <MateriaCursoFormModal
          initial={editMateriaCurso}
          colegios={colegios}
          unidades={unidades}
          cursos={cursos}
          materias={materias}
          profesores={profesores}
          onSave={handleSave}
          onCancel={() => {setModalOpen(false); setEditMateriaCurso(null); }}
        />
      )}
      
    </section>
  );
}