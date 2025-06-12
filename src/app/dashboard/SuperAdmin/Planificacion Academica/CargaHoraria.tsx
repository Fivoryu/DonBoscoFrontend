import AxiosInstance from "@/components/AxiosInstance";
import { CargaHoraria, Especialidad, Profesor, ProfesorEspecialidad } from "@/app/modelos/Personal";
import { useState, useEffect } from "react";
import { UnidadEducativa, Colegio } from "@/app/modelos/Institucion";
import { CalendarioAcademico, Periodo } from "@/app/modelos/Calendario";
import CargaFormModal from "./components/CargaFormModal";
import CargasTable from "./components/CargasTable";

export default function SuperAdminCargaHoraria() {
  // Datos principales
  const [cargas, setCargas] = useState<CargaHoraria[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [calendarios, setCalendarios] = useState<CalendarioAcademico[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [profesorEspecialidades, setProfesorEspecialidades] = useState<Record<number, Especialidad[]>>({});

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCarga, setEditCarga] = useState<CargaHoraria | null>(null);

  // Fetch inicial
  useEffect(() => {
    setLoading(true);
    Promise.all([
      AxiosInstance.get<CargaHoraria[]>("/personal/carga_horaria/listar/"),
      AxiosInstance.get<Profesor[]>("/personal/profesores/listar/"),
      AxiosInstance.get<Especialidad[]>("/personal/especialidades/listar/"),
      AxiosInstance.get<UnidadEducativa[]>("/institucion/unidades-educativas/listar/"),
      AxiosInstance.get<Colegio[]>("/institucion/colegios/listar/"),
      AxiosInstance.get<CalendarioAcademico[]>("/calendario/calendarios/listar/"),
      AxiosInstance.get<Periodo[]>("/calendario/periodos/listar/"),
      AxiosInstance.get<ProfesorEspecialidad[]>("/personal/asignaciones/listar/"),
    ])
      .then(([resC, resP, resE, resU, resCol, resCal, resPer, resPE]) => {
        setCargas(resC.data);
        setProfesores(resP.data);
        setEspecialidades(resE.data);
        setUnidades(resU.data);
        setColegios(resCol.data);
        setCalendarios(resCal.data);
        setPeriodos(resPer.data);
        // Mapear especialidades por profesor
        const map: Record<number, Especialidad[]> = {};
        resPE.data.forEach(pe => {
          const pid = pe.profesor.usuario.id;
          if (!map[pid]) map[pid] = [];
          map[pid].push(pe.especialidad);
        });
        setProfesorEspecialidades(map);
      })
      .catch(() => setError("No se pudieron cargar los datos."))
      .finally(() => setLoading(false));
  }, []);

  // Guardar nueva carga horaria
  const handleSave = async (form: {
    colegio: number | "";
    unidad: number | "";
    calendario: number | "";
    periodo: number | "";
    profesor: number | "";
    especialidad: number | "";
    horas: number;
  }) => {
    try {
      // Buscar id de ProfesorEspecialidad
      let profesorEspecialidadId: number | null = null;
      if (form.profesor && form.especialidad) {
        const res = await AxiosInstance.get<ProfesorEspecialidad[]>(
          `/personal/asignaciones/?profesor=${form.profesor}&especialidad=${form.especialidad}`
        );
        if (res.data.length > 0) {
          profesorEspecialidadId = res.data[0].id;
        }
      }
      if (!profesorEspecialidadId) {
        alert("Debe seleccionar un profesor con especialidad válida.");
        return;
      }
      const payload = {
        profesor_especialidad: profesorEspecialidadId,
        horas: form.horas,
        periodo: form.periodo,
      };
      const response = await AxiosInstance.post<CargaHoraria>(
        "/personal/carga_horaria/crear/",
        payload
      );
      setCargas(prev => [...prev, response.data]);
      setModalOpen(false);
      setEditCarga(null);
    } catch (error) {
      alert("Error al guardar la carga horaria.");
    }
  };

  // Eliminar carga horaria
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta carga horaria?")) return;
    try {
      await AxiosInstance.delete(`/personal/carga_horaria/${id}/eliminar/`);
      setCargas(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Error al eliminar la carga horaria.");
    }
  };

  // Ordenar cargas horarias
  const [sortKey, setSortKey] = useState<keyof CargaHoraria>("id");
  const [asc, setAsc] = useState(true);
  const toggleSort = (key: string) => {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key as keyof CargaHoraria);
      setAsc(true);
    }
  }


  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Cargas Horarias</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva
        </button>
      </header>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      <CargasTable
        cargas={cargas}
        sortKey={sortKey}
        asc={asc}
        onToggleSort={toggleSort}
        onEdit={setEditCarga}
        onDelete={handleDelete}
      />
      {modalOpen && (
        <CargaFormModal
          initial={editCarga}
          colegios={colegios}
          unidades={unidades}
          calendarios={calendarios}
          periodos={periodos}
          profesores={profesores}
          especialidades={especialidades}
          profesorEspecialidades={profesorEspecialidades}
          onCancel={() => { setModalOpen(false); setEditCarga(null); }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}