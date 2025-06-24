import { Licencia } from "@/app/modelos/Asistencia";

const STATUS_COLORS: Record<Licencia["estado"], string> = {
  SOL: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APR: "bg-green-100 text-green-800 border-green-300",
  REC: "bg-red-100 text-red-800 border-red-300",
  FIN: "bg-gray-100 text-gray-600 border-gray-300",
};

const STATUS_LABELS: Record<Licencia["estado"], string> = {
  SOL: "Solicitada",
  APR: "Aprobada",
  REC: "Rechazada",
  FIN: "Finalizada",
};

export default function LicenciasStatusBadge({ estado }: { estado: Licencia["estado"] }) {
  return (
    <span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${STATUS_COLORS[estado]}`}>{STATUS_LABELS[estado]}</span>
  );
}
