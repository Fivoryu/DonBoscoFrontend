import { Licencia } from "@/app/modelos/Asistencia";

interface LicenciaDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  licencia?: Licencia | null;
  onCancel?: (licencia: Licencia) => void;
}

export default function LicenciaDetailDrawer({ open, onClose, licencia, onCancel }: LicenciaDetailDrawerProps) {
  if (!open || !licencia) return null;

  const puedeCancelar = licencia.estado === "SOL" || licencia.estado === "APR";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-xl p-6 overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">×</button>
        <h2 className="text-2xl font-bold mb-4">Detalle de Licencia</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Estudiante:</span> {licencia.estudiante.usuario.nombre} {licencia.estudiante.usuario.apellido}
          </div>
          <div>
            <span className="font-semibold">Fecha inicio:</span> {licencia.fecha_inicio}
          </div>
          <div>
            <span className="font-semibold">Fecha fin:</span> {licencia.fecha_fin}
          </div>
          <div>
            <span className="font-semibold">Motivo:</span> {licencia.motivo}
          </div>
          <div>
            <span className="font-semibold">Estado:</span> {licencia.estado}
          </div>
          {licencia.archivo && typeof licencia.archivo === "string" && (
            <div>
              <span className="font-semibold">Archivo:</span> <a href={licencia.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver archivo</a>
            </div>
          )}
          {licencia.archivo && typeof licencia.archivo !== "string" && (
            <div>
              <span className="font-semibold">Archivo:</span> Archivo adjunto
            </div>
          )}
        </div>
        {puedeCancelar && onCancel && (
          <button
            onClick={() => onCancel(licencia)}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cancelar licencia
          </button>
        )}
      </div>
    </div>
  );
}
