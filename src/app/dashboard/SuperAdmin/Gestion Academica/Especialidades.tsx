import { Materia, Grado } from "@/app/modelos/Academico";
import AxiosInstance from "@/components/AxiosInstance";
import { useState, useEffect } from "react";
import { Especialidad } from "@/app/modelos/Personal";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";
import EspecialidadFormModal from "./components/EspecialidadFormModal";
import EspecialidadesTable from "./components/EspecialidadesTable";
import { Row } from "./components/EspecialidadesTable";


export default function SuperAdminEspecialidad() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Row>("id");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEspecialidad, setEditEspecialidad] = useState<Especialidad | null>(null);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get<Especialidad[]>("/personal/especialidades/listar/"),
      AxiosInstance.get<Materia[]>("/academico/materias/listar/"),
      AxiosInstance.get<Colegio[]>("/institucion/colegios/listar/"),
      AxiosInstance.get<UnidadEducativa[]>("institucion/unidades-educativas/listar/"),
      AxiosInstance.get<Grado[]>("/academico/grados/listar/")
    ])
    .then(([resE, resM, resC, resU, resG]) => {
      setEspecialidades(resE.data);
      setMaterias(resM.data);
      setColegios(resC.data);
      setUnidades(resU.data);
      setGrados(resG.data);
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

  const handleEdit = (h: Especialidad | null) => { setEditEspecialidad(h); setModalOpen(true); };

  const handleSave = (updated: Especialidad) => {
    if (editEspecialidad) setMaterias(prev => prev.map(m => m.id === updated.id ? updated : m));
    else setMaterias(prev => [...prev, updated]);
    setModalOpen(false);
    setEditEspecialidad(null);
  }

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Especialidades</h1>
        <button onClick={() => handleEdit(null)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo
        </button>
      </header>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <EspecialidadesTable
          especialidades={especialidades}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <EspecialidadFormModal
          initial={editEspecialidad}
          colegios={colegios}
          unidades={unidades}
          materias={materias}
          grados={grados}
          onSave={handleSave}
          onCancel={() => {setModalOpen(false); setEditEspecialidad(null); }}
        />
      )}
      
    </section>
  );
}