import { Licencia } from "@/app/modelos/Asistencia";
import LicenciasStatusBadge from "./LicenciasStatusBadge";
import { useState } from "react";

interface Props {
  licencias: Licencia[];
  loading?: boolean;
  error?: any;
  pageSize?: number;
  onRowClick?: (licencia: Licencia) => void;
}

export default function LicenciaTable({ licencias, loading, error, pageSize = 10, onRowClick }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(licencias.length / pageSize);
  const paginated = licencias.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error al cargar licencias</div>;

  return (
    <div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Estudiante</th>
              <th className="px-4 py-2 text-left">Fecha inicio</th>
              <th className="px-4 py-2 text-left">Fecha fin</th>
              <th className="px-4 py-2 text-left">Motivo</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Archivo</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Sin licencias</td>
              </tr>
            ) : (
              paginated.map(lic => (
                <tr
                  key={lic.estudiante.id + lic.fecha_inicio + lic.fecha_fin}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => onRowClick && onRowClick(lic)}
                >
                  <td className="px-4 py-2 whitespace-nowrap">{lic.estudiante.usuario.nombre} {lic.estudiante.usuario.apellido}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{lic.fecha_inicio}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{lic.fecha_fin}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{lic.motivo}</td>
                  <td className="px-4 py-2 whitespace-nowrap"><LicenciasStatusBadge estado={lic.estado} /></td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lic.archivo && typeof lic.archivo === "string" ? (
                      <a href={lic.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver</a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-2 py-1 rounded border bg-gray-100"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="text-sm">Página {page} de {totalPages}</span>
          <button
            className="px-2 py-1 rounded border bg-gray-100"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
