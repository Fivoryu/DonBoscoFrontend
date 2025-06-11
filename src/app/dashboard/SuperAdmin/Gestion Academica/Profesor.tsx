// src/app/dashboard/SuperAdmin/GestionPersonal/Profesor.tsx
import { ProfesorEspecialidad, Especialidad, Profesor } from "@/app/modelos/Personal";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";
import AxiosInstance from "@/components/AxiosInstance";
import { useState, useEffect } from "react";
import ProfesorFormModal from "./components/ProfesorFormModal";
import ProfesorTable, { Row } from "./components/ProfesorTable";

export default function SuperAdminProfesor() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [profesorEspecialidades, setProfesorEspecialidades] = useState<ProfesorEspecialidad[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Row>("id");
  const [asc, setAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProfesor, setEditProfesor] = useState<ProfesorEspecialidad | null>(null);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get<Profesor[]>("/personal/profesores/listar/"),
      AxiosInstance.get<ProfesorEspecialidad[]>("/personal/asignaciones/listar/"),
      AxiosInstance.get<Especialidad[]>("/personal/especialidades/listar/"),
      AxiosInstance.get<Colegio[]>("/institucion/colegios/listar/"),
      AxiosInstance.get<UnidadEducativa[]>("/institucion/unidades-educativas/listar/"),
    ])
      .then(([resP, resPE, resE, resC, resU]) => {
        setProfesores(resP.data);
        setProfesorEspecialidades(resPE.data);
        setEspecialidades(resE.data);
        setColegios(resC.data);
        setUnidades(resU.data);
      })
      .catch(() => setError("No se pudieron cargar los datos."))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Row) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este profesor?")) return;
    try {
      await AxiosInstance.delete(`/personal/profesores/${id}/eliminar/`);
      setProfesores(prev => prev.filter(p => p.usuario.id !== id));
      setProfesorEspecialidades(prev => prev.filter(pe => pe.profesor.usuario.id !== id));
    } catch {
      alert("Error al eliminar el profesor.");
    }
  };

  const handleEdit = (rowId: number) => {
    const prof = profesores.find(p => p.usuario.id === rowId);
    if (!prof) return;
    
    const asig = profesorEspecialidades.find(pe => pe.profesor.usuario.id === rowId) || null;

    const initialPE: ProfesorEspecialidad = asig ?? {
      id: 0,                                    
      profesor: prof,                           
      especialidad: {                           
        id: 0,
        nombre: "",
        materia: { id: 0, nombre: "" },
      },
      fecha_asignacion: ""                     
    };

    setEditProfesor(initialPE);
    setModalOpen(true);
  };

  // 2) Guardar: recibimos un ProfesorEspecialidad
  const handleSave = (updated: ProfesorEspecialidad | null) => {
    if (editProfesor) {
      // ediciónz
      if (updated) {
        setProfesorEspecialidades(prev =>
          prev.map(pe => (pe.id === updated.id ? updated : pe))
        );
      }
      if (updated) {
        setProfesores(prev =>
          prev.map(p =>
            p.usuario.id === updated.profesor.usuario.id ? updated.profesor : p
          )
        );
      }
    } else {
      // creación
      if (updated)
      {
        setProfesores(prev => [...prev, updated.profesor]);
        setProfesorEspecialidades(prev => [...prev, updated]);
      }
    }
    setModalOpen(false);
    setEditProfesor(null);
  };

  console.log(profesores)

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Profesores</h1>
        <button
          onClick={() => { setEditProfesor(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </header>

      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && !error && (
        <ProfesorTable
          profesores={profesores}
          profesorEspecialidades={profesorEspecialidades}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}     // ahora recibe row.id
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <ProfesorFormModal
          initial={editProfesor}   // ProfesorEspecialidad|null
          especialidades={especialidades}
          colegios={colegios}
          unidades={unidades}
          onSave={handleSave}      // recibe ProfesorEspecialidad
          onCancel={() => {
            setModalOpen(false);
            setEditProfesor(null);
          }}
        />
      )}
    </section>
  );
}
