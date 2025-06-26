'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"

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
  licencia: Licencia
  onClose: () => void
  onStatusChange: () => Promise<void>  // ✅ para recargar las licencias desde el padre
}

export default function LicenciaModal({ licencia, onClose, onStatusChange }: Props) {
  const [estado, setEstado] = useState<'SOL' | 'APR' | 'REC'>(licencia.estado)

  const handleGuardar = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/licencias/${licencia.id}/editar/`, {
        estado,
        estudiante: licencia.estudiante.id, 
        fecha_inicio: licencia.fecha_inicio,
        fecha_fin: licencia.fecha_fin,
        motivo: licencia.motivo,
      })
      await onStatusChange()
      onClose()
    } catch (error: any) {
      console.error("❌ Error al editar licencia:", error?.response?.data || error.message);
      console.log("📋 Detalle del error:", error.response?.data);
      throw error;
    }
  }


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Licencia de {licencia.estudiante.usuario.nombre} {licencia.estudiante.usuario.apellido}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div>
            <Label>Motivo</Label>
            <p>{licencia.motivo}</p>
          </div>
          <div className="flex gap-4">
            <div>
              <Label>Inicio</Label>
              <p>{licencia.fecha_inicio}</p>
            </div>
            <div>
              <Label>Fin</Label>
              <p>{licencia.fecha_fin}</p>
            </div>
          </div>
          <div>
            <Label>Archivo</Label>
            {licencia.archivo ? (
              <a
                href={licencia.archivo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Ver archivo
              </a>
            ) : (
              <p>No se adjuntó archivo</p>
            )}
          </div>
          <div>
            <Label>Estado</Label>
            <Select value={estado} onValueChange={(val) => setEstado(val as 'SOL' | 'APR' | 'REC')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOL">Solicitado</SelectItem>
                <SelectItem value="APR">Aprobado</SelectItem>
                <SelectItem value="REC">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleGuardar}>Guardar cambios</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
