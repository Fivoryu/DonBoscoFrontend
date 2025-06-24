import { useEffect, useState } from "react";
import { getNotasFinales } from "@/app/api/evaluacionApi";
import { Download } from "lucide-react";

const NotaFinalPage = () => {
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    try {
      const res = await getNotasFinales();
      setNotas(res.data);
    } catch (error) {
      console.error("Error al obtener notas finales", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Notas Finales</h2>
        <button
          onClick={() => alert("Exportar funcionalidad próximamente")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Exportar
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando notas finales...</p>
      ) : (
        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Estudiante</th>
                <th className="px-4 py-2">Materia</th>
                <th className="px-4 py-2">Periodo</th>
                <th className="px-4 py-2">Nota Final</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((nota) => (
                <tr key={nota.id} className="border-t">
                  <td className="px-4 py-2">
                    {nota.estudiante.usuario.nombre} {nota.estudiante.usuario.apellido}
                  </td>
                  <td className="px-4 py-2">{nota.materia_curso.materia.nombre}</td>
                  <td className="px-4 py-2">{nota.periodo.nombre}</td>
                  <td className="px-4 py-2 font-semibold">{nota.nota_final}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        nota.estado === "aprobado"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {nota.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotaFinalPage;
