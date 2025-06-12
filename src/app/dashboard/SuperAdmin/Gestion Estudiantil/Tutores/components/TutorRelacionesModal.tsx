// src/app/dashboard/SuperAdmin/GestionPersonal/components/TutorRelacionesModal.tsx
import { TutorEstudiante } from "@/app/modelos/Estudiantes";

interface Props {
  relaciones: TutorEstudiante[];
  onClose: () => void;
}

export default function TutorRelacionesModal({ relaciones, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Relaciones del Tutor</h2>

        {relaciones.length === 0 ? (
          <p className="text-center text-gray-500">No tiene estudiantes asignados.</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {relaciones.map(rel => (
              <li key={rel.id} className="border-b py-2">
                <div className="font-semibold">
                  {rel.estudiante.usuario.nombre} {rel.estudiante.usuario.apellido}
                </div>
                <div className="text-sm text-gray-600">
                  RUDE: {rel.estudiante.rude}
                  <br />
                  Fecha asignación: {rel.fecha_asignacion}
                  <br />
                  Principal: {rel.es_principal ? "Sí" : "No"}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
