import { useState } from "react";

interface NotaFinal {
  materia_curso: {
    materia: {
      nombre: string;
    };
  };
  nota_final: string;
  periodo: {
    nombre: string;
  };
}

interface Props {
  notas: NotaFinal[];
}

export default function TablaNotasFinales({ notas }: Props) {
  const [colapsadas, setColapsadas] = useState<Record<string, boolean>>({});

  const notasAgrupadas = notas.reduce((acc: Record<string, NotaFinal[]>, nota) => {
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
      <h3 className="text-xl font-semibold mb-3">Notas Finales por Materia</h3>
      {Object.entries(notasAgrupadas).map(([periodo, notas]) => (
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
                  <th className="px-4 py-2">Nota Final</th>
                </tr>
              </thead>
              <tbody>
                {notas.map((nota, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{nota.materia_curso?.materia?.nombre}</td>
                    <td className="px-4 py-2 text-center">{nota.nota_final}</td>
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
