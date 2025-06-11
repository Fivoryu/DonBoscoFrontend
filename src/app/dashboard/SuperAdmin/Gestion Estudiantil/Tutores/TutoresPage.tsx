// src/app/dashboard/SuperAdmin/GestionPersonal/Tutores.tsx
import { useEffect, useState } from "react";
import { Tutor, Estudiante, TutorEstudiante } from "@/app/modelos/Estudiantes";
import AxiosInstance from "@/components/AxiosInstance";
import TutorFormModal from "./components/TutorFormModal";
import TutorTable, { Row } from "./components/TutoresTable";
import { emptyTutorEstudiante } from "@/app/modelos/helpers";
import TutorRelacionesModal from "./components/TutorRelacionesModal";

export default function SuperAdminTutores() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [relaciones, setRelaciones] = useState<TutorEstudiante[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTutor, setEditTutor] = useState<TutorEstudiante | null>(null);
  const [sortKey, setSortKey] = useState<keyof Row>("id");
  const [asc, setAsc] = useState(true);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get("/estudiantes/tutores/listar/"),
      AxiosInstance.get("/estudiantes/relaciones/listar/"),
      AxiosInstance.get("/estudiantes/estudiantes/listar/")
    ])
      .then(([resT, resR, resE]) => {
        setTutores(resT.data);
        setRelaciones(resR.data);
        setEstudiantes(resE.data);
      })
      .catch(() => alert("Error al cargar los datos."))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key: keyof Row) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };


  const handleEdit = (id: number) => {
    const tutor = tutores.find(t => t.usuario.id === id);
    const relacion = relaciones.find(r => r.tutor.usuario.id === id);
    if (!tutor) return;

    const initial: TutorEstudiante = relacion ?? {
      ...emptyTutorEstudiante(),
      tutor: tutor
    };

    setEditTutor(initial);
    setModalOpen(true);
  };


  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este tutor?")) return;
    try {
      await AxiosInstance.delete(`/estudiantes/tutores/${id}/eliminar/`);
      setTutores(prev => prev.filter(t => t.usuario.id !== id));
      setRelaciones(prev => prev.filter(r => r.tutor.usuario.id !== id));
    } catch {
      alert("Error al eliminar.");
    }
  };

  const handleSave = (relacion: TutorEstudiante | null) => {
    if (relacion) {
      setTutores(prev => {
        const exists = prev.some(t => t.usuario.id === relacion.tutor.usuario.id);
        return exists
          ? prev.map(t => (t.usuario.id === relacion.tutor.usuario.id ? relacion.tutor : t))
          : [...prev, relacion.tutor];
      });
      setRelaciones(prev => {
        const exists = prev.some(r => r.id === relacion.id);
        return exists
          ? prev.map(r => (r.id === relacion.id ? relacion : r))
          : [...prev, relacion];
      });
    }
    setModalOpen(false);
    setEditTutor(null);
  };

  // justo antes del return en Tutores.tsx
  const [verRelacionesOpen, setVerRelacionesOpen] = useState(false);
  const [selectedRelaciones, setSelectedRelaciones] = useState<TutorEstudiante[]>([]);

  const handleVerRelaciones = (tutorId: number) => {
    const rels = relaciones.filter(r => r.tutor.usuario.id === tutorId);
    setSelectedRelaciones(rels);
    setVerRelacionesOpen(true);
  };

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Tutores</h1>
        <button
          onClick={() => { setEditTutor(null); setModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </header>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <TutorTable
          tutores={tutores}
          relaciones={relaciones}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onVerRelaciones={handleVerRelaciones}
        />
      )}

      {modalOpen && (
        <TutorFormModal
          initial={editTutor}
          estudiantes={estudiantes}
          onSave={handleSave}
          onCancel={() => {
            setEditTutor(null);
            setModalOpen(false);
          }}
        />
      )}
      {verRelacionesOpen && (
        <TutorRelacionesModal
          relaciones={selectedRelaciones}
          onClose={() => {
            setVerRelacionesOpen(false);
            setSelectedRelaciones([]);
          }}
        />
      )}
    </section>

  );
}
