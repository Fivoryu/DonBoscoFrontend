import { useState } from "react";

interface NotaActividad {
  actividad: {
    nombre: string;
    materia: {
      nombre: string;
    };
  };
  calificacion: number;
  periodo: {
    nombre: string;
  };
}

interface Props {
  notas: NotaActividad[];
}

export default function TablaNotasActividades({ notas }: Props) {
  const [colapsadas, setColapsadas] = useState<Record<string, boolean>>({});

  const agrupadas = notas.reduce((acc: Record<string, NotaActividad[]>, nota) => {
    const periodo = nota.periodo?.nombre || "Sin período";
    if (!acc[periodo]) acc[periodo] = [];
    acc[periodo].push(nota);
    return acc;
  }, {});

  const togglePeriodo = (periodo: string) => {
    setColapsadas((prev) => ({ ...prev, [periodo]: !prev[periodo] }));
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">Notas por Actividad</h3>
      {Object.entries(agrupadas).map(([periodo, actividades]) => (
        <div key={periodo} className="mb-4 border rounded overflow-hidden">
          <button
            onClick={() => togglePeriodo(periodo)}
            className="w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 font-medium"
          >
            {periodo} {colapsadas[periodo] ? "▲" : "▼"}
          </button>
          {!colapsadas[periodo] && (
            <table className="w-full text-left bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Materia</th>
                  <th className="px-4 py-2">Actividad</th>
                  <th className="px-4 py-2">Calificación</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map((nota, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{nota.actividad?.materia?.nombre}</td>
                    <td className="px-4 py-2">{nota.actividad?.nombre}</td>
                    <td className="px-4 py-2">{nota.calificacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
