// BitacoraUsuarioPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Bitacora } from "@/app/modelos/Usuarios";
import {
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function BitacoraUsuarioPage() {
  const { usuarioId } = useParams<{ usuarioId: string }>();
  const navigate = useNavigate();

  const [datos, setDatos] = useState<{
    results: Bitacora[];
    next: string | null;
    previous: string | null;
    count: number;
  }>({ results: [], next: null, previous: null, count: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!usuarioId) return;
    setLoading(true);
    setError("");
    console.log("Entrando a bitacora")

    AxiosInstance.get("/user/auth/bitacoras/listar/", {
      params: { usuario: usuarioId, page },
    })
      .then((res) => {
        // Aseguramos la estructura de paginación
        const { results, next, previous, count } = res.data;
        setDatos({ results, next, previous, count });
      })
      .catch(() => {
        setError("No fue posible cargar la bitácora. Intenta de nuevo.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [usuarioId, page]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("es-BO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log()

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <h1 className="text-2xl font-semibold mb-4">
        Bitácora del usuario #{usuarioId}
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : datos.results.length === 0 ? (
        <p className="text-gray-700">No hay registros para este usuario.</p>
      ) : (
        <>
          {/* Contenedor con altura máxima y scroll vertical */}
          <div className="overflow-x-auto bg-white rounded-lg shadow max-h-[70vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Fecha","Acción","Tabla","Descripción","IP","Hora salida"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {datos.results.map((b, i) => (
                  <tr key={b.id} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {formatDate(b.fecha)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 capitalize">
                      {b.accion}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {b.tabla_afectada ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {b.descripcion ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {b.ip ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {b.hora_salida ? formatDate(b.hora_salida) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={!datos.previous}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {page} de {Math.ceil(datos.count / 30)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!datos.next}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
