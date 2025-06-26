import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EstudianteInfo from "./components/EstudianteInfo";
import TablaNotasFinales from "./components/TablaNotasFinales";
import TablaNotasActividades from "./components/TablaNotasActividades";
import AxiosInstance from "@/components/AxiosInstance";

const BoletinDetalle = () => {
  const { id } = useParams();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [estudiante, setEstudiante] = useState<any>(null);
  const [notas, setNotas] = useState({ notas_finales: [], notas_actividades: [] });
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Obtener información del estudiante
        const estRes = await AxiosInstance.get(`/estudiantes/estudiantes/${id}/mi-estudiante/`);
        setEstudiante(estRes.data);

        // Obtener notas finales y de actividades
        const notasRes = await AxiosInstance.get(`/estudiantes/estudiantes/${id}/notas/?anio=${anio}`);
        console.log("📚 Notas recibidas:", notasRes.data);

        setNotas({
          notas_finales: notasRes.data.notas_finales || [],
          notas_actividades: notasRes.data.notas_actividades || [],
        });

      } catch (err) {
        console.error("❌ Error al cargar boletín:", err);
        alert("Ocurrió un error al cargar los datos del boletín.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, anio]);


  if (loading) return <p className="text-center mt-4">Cargando boletín...</p>;
  if (!estudiante) return <p className="text-center mt-4">Estudiante no encontrado.</p>;

  return (
    <>
      <div ref={pdfRef} className="bg-white p-6 rounded shadow space-y-4" id="boletin-pdf">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Boletín Académico</h2>
          <div>
            <label className="mr-2 font-medium">Año:</label>
            <select
              value={anio}
              onChange={(e) => setAnio(parseInt(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[2023, 2024, 2025].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <EstudianteInfo estudiante={estudiante} />
        <TablaNotasFinales notas={notas.notas_finales} />
        <TablaNotasActividades notas={notas.notas_actividades} />
      </div>


    </>
  );
};

export default BoletinDetalle;
