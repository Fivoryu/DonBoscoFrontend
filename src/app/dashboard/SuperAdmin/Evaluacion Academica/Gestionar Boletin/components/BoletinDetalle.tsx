import { useEffect, useState, useRef } from "react"
import AxiosInstance from "@/components/AxiosInstance"
// @ts-ignore
import html2pdf from "html2pdf.js"

interface Boletin {
  id: number
  nota_final: string
  estado: "APR" | "REP" | "INC"
  fecha_calculo: string
  materia_curso: {
    materia: {
      nombre: string
    }
  }
  periodo: {
    id: number
    nombre: string
  }
}

interface EstudianteInfo {
  id: number
  usuario: { id: number }
  curso: { nombre: string }
}

interface Usuario {
  nombre: string
  apellido: string
  ci: string
  email: string
}

interface Props {
  estudianteId: number
  onVolver: () => void
}

export default function BoletinDetalle({ estudianteId, onVolver }: Props) {
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [notas, setNotas] = useState<Boletin[]>([])
  const [periodosAbiertos, setPeriodosAbiertos] = useState<Record<string, boolean>>({})
  const [estudianteInfo, setEstudianteInfo] = useState<EstudianteInfo | null>(null)
  const [usuarioInfo, setUsuarioInfo] = useState<Usuario | null>(null)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const estudianteRes = await AxiosInstance.get<EstudianteInfo>(`/estudiantes/estudiantes/${estudianteId}/`)
        setEstudianteInfo(estudianteRes.data)

        const usuarioId = estudianteRes.data.usuario.id
        const usuarioRes = await AxiosInstance.get<Usuario>(`/user/auth/usuarios/${usuarioId}`)
        setUsuarioInfo(usuarioRes.data)

        const notasRes = await AxiosInstance.get<{ notas_finales: Boletin[] }>(
          `/estudiantes/estudiantes/${estudianteId}/notas?anio=${anio}`
        )
        setNotas(notasRes.data.notas_finales)

        const periodos = notasRes.data.notas_finales.reduce((acc: Record<string, boolean>, nota: Boletin) => {
          acc[nota.periodo.nombre] = true
          return acc
        }, {})
        setPeriodosAbiertos(periodos)
      } catch (error) {
        console.error("❌ Error al cargar boletín:", error)
      }
    }

    fetchDatos()
  }, [estudianteId, anio])

  const estadoLabel = {
    APR: "Aprobado",
    REP: "Reprobado",
    INC: "Incompleto",
  }

  const notasPorPeriodo = notas.reduce<Record<string, Boletin[]>>((acc, nota) => {
    const periodo = nota.periodo.nombre
    if (!acc[periodo]) acc[periodo] = []
    acc[periodo].push(nota)
    return acc
  }, {})

  const togglePeriodo = (periodo: string) => {
    setPeriodosAbiertos(prev => ({
      ...prev,
      [periodo]: !prev[periodo],
    }))
  }

  const exportarPDF = () => {
    const elemento = pdfRef.current
    if (elemento) {
      const opt = {
        margin: 0.5,
        filename: `boletin_${usuarioInfo?.ci || "estudiante"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      }

      try {
        html2pdf().set(opt).from(elemento).save()
      } catch (error) {
        console.error("❌ Error al generar PDF:", error)
      }
    }
  }

  return (
    <div style={{ marginTop: "20px", padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Boletín del Estudiante</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={onVolver}
          style={{ padding: "8px 16px", backgroundColor: "#6b7280", color: "#fff", borderRadius: "4px", border: "none" }}
        >
          ← Volver a estudiantes
        </button>

        <label>
          Año:{" "}
          <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
            {[2022, 2023, 2024, 2025].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <button
          onClick={exportarPDF}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            backgroundColor: "#16a34a",
            color: "#fff",
            borderRadius: "4px",
            border: "none"
          }}
        >
          📄 Exportar PDF
        </button>
      </div>

      <div ref={pdfRef} id="boletin-pdf">
        {usuarioInfo && estudianteInfo && (
          <div style={{ marginBottom: "24px", padding: "16px", border: "1px solid #ccc" }}>
            <p><strong>Nombre:</strong> {usuarioInfo.nombre} {usuarioInfo.apellido}</p>
            <p><strong>CI:</strong> {usuarioInfo.ci}</p>
            <p><strong>Email:</strong> {usuarioInfo.email}</p>
            <p><strong>Curso:</strong> {estudianteInfo.curso.nombre}</p>
            <p><strong>Año:</strong> {anio}</p>
          </div>
        )}

        {Object.keys(notasPorPeriodo).length === 0 ? (
          <p style={{ color: "#6b7280" }}>No hay notas registradas.</p>
        ) : (
          Object.entries(notasPorPeriodo).map(([periodo, notasPeriodo]) => (
            <div key={periodo} style={{ marginBottom: "24px", border: "1px solid #ccc" }}>
              <button
                onClick={() => togglePeriodo(periodo)}
                style={{ width: "100%", textAlign: "left", fontWeight: "bold", padding: "8px", backgroundColor: "#eee", border: "none" }}
              >
                {periodo} {periodosAbiertos[periodo] ? "▲" : "▼"}
              </button>

              {periodosAbiertos[periodo] && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f9fafb" }}>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Materia</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nota Final</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Estado</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Fecha de Cálculo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notasPeriodo.map(nota => (
                      <tr key={nota.id}>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{nota.materia_curso.materia.nombre}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{nota.nota_final}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{estadoLabel[nota.estado]}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                          {new Date(nota.fecha_calculo).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
