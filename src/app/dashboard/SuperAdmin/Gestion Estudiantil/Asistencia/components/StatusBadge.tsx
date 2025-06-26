interface StatusBadgeProps {
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  ASI: "bg-green-100 text-green-800 border-green-300",
  FAL: "bg-red-100 text-red-800 border-red-300",
  TAR: "bg-yellow-100 text-yellow-800 border-yellow-300",
  JUS: "bg-blue-100 text-blue-800 border-blue-300",
  LIC: "bg-purple-100 text-purple-800 border-purple-300",
  SOL: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APR: "bg-green-100 text-green-800 border-green-300",
  REC: "bg-red-100 text-red-800 border-red-300",
  FIN: "bg-gray-100 text-gray-600 border-gray-300",
};

const STATUS_LABELS: Record<string, string> = {
  ASI: "Asistió",
  FAL: "Faltó",
  TAR: "Tardó",
  JUS: "Justificó",
  LIC: "Con licencia",
  SOL: "Solicitada",
  APR: "Aprobada",
  REC: "Rechazada",
  FIN: "Finalizada",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
