import { useState } from "react";
import { useLicencias } from "../hooks/useLicencias";
import LicenciaTable from "../components/LicenciaTable";
import LicenciaFormModal from "./LicenciaFormModal";
import LicenciaDetailDrawer from "./LicenciaDetailDrawer";
import { useAuth } from "@/app/contexts/AuthContext";
import { Licencia } from "@/app/modelos/Asistencia";
import { useEstudiantesByTutor } from "../../../hooks/useEstudiantes";

export default function TutorLicenciasPage() {
  const { user } = useAuth();
  const tutorId = user?.id;

  // Obtener estudiantes asignados al tutor
  const { data: estudiantes = [] } = useEstudiantesByTutor(tutorId ?? 0);

  // Evita llamar useLicencias si tutorId no está definido
  const {
    licencias,
    isLoading,
    error,
    createLicencia,
    deleteLicencia,
    refetch,
  } = useLicencias(tutorId ?? 0); // Usa 0 como valor por defecto, o maneja el caso según tu lógica

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLicencia, setSelectedLicencia] = useState<Licencia | null>(null);

  // Crear licencia
  const handleCreate = (data: Partial<Licencia>) => {
    createLicencia.mutate(data, {
      onSuccess: () => {
        setModalOpen(false);
        refetch();
      },
    });
  };

  // Cancelar licencia
  const handleCancel = (licencia: Licencia) => {
    // Aquí podrías cambiar el estado a "FIN" o eliminar, según tu lógica
    deleteLicencia.mutate(licencia as any, {
      onSuccess: () => {
        setSelectedLicencia(null);
        refetch();
      },
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Licencias</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          Nueva licencia
        </button>
      </div>
      <LicenciaTable
        licencias={licencias}
        loading={isLoading}
        error={error}
        onRowClick={setSelectedLicencia}
      />
      <LicenciaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        estudiantes={estudiantes}
      />
      <LicenciaDetailDrawer
        open={!!selectedLicencia}
        onClose={() => setSelectedLicencia(null)}
        licencia={selectedLicencia}
        onCancel={handleCancel}
      />
    </div>
  );
}
