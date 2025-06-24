import { NotaFinalMateria } from "../types"

interface Props {
  notas: NotaFinalMateria[]
}

export default function BoletinTable({ notas }: Props) {
  return (
    <div className="overflow-x-auto mt-6 border rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Materia</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Nota Final</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Estado</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Periodo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {notas.map((nota, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{nota.materia_curso.materia.nombre}</td>
              <td className="px-4 py-2">{nota.nota_final}</td>
              <td className="px-4 py-2">
                {nota.estado === "APR" && <span className="text-green-600 font-semibold">Aprobado</span>}
                {nota.estado === "REP" && <span className="text-red-600 font-semibold">Reprobado</span>}
                {nota.estado === "INC" && <span className="text-yellow-600 font-semibold">Incompleto</span>}
              </td>
              <td className="px-4 py-2">{nota.periodo.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
