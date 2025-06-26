'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Eye } from "lucide-react"

interface Licencia {
  id: number
  motivo: string
  fecha_inicio: string
  fecha_fin: string
  estado: 'SOL' | 'APR' | 'REC'
  archivo: string | null
  estudiante: {
    id: number
    usuario: {
      nombre: string
      apellido: string
    }
  }
}

interface Props {
  data: Licencia[]
  onView: (licencia: Licencia) => void
}

export default function LicenciasTable({ data, onView }: Props) {
  const estadoTexto = {
    SOL: "Solicitado",
    APR: "Aprobado",
    REC: "Rechazado",
  }

  const estadoColor = {
    SOL: "default",
    APR: "success",
    REC: "destructive",
  } as const

  if (!Array.isArray(data)) {
    return <p className="text-red-500 p-4">Error: no se pudieron cargar las licencias.</p>
  }
  return (
    <ScrollArea className="rounded-md border max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Fecha inicio</TableHead>
            <TableHead>Fecha fin</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {data.map((licencia) => (
            <TableRow key={licencia.id}>
              <TableCell>
                {licencia.estudiante.usuario.nombre} {licencia.estudiante.usuario.apellido}
              </TableCell>
              <TableCell>{licencia.motivo}</TableCell>
              <TableCell>{licencia.fecha_inicio}</TableCell>
              <TableCell>{licencia.fecha_fin}</TableCell>
              <TableCell>
                <Badge variant={estadoColor[licencia.estado]}>
                  {estadoTexto[licencia.estado]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => onView(licencia)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
