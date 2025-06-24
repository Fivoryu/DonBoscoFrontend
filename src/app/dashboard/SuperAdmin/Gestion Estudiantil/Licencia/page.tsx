'use client'

import { useEffect, useState } from 'react'
import LicenciasTable from './components/LicenciasTable'
import LicenciaModal from './components/LicenciaModal'
import axios from 'axios'


interface Licencia {
  id: number
  motivo: string
  fecha_inicio: string
  fecha_fin: string
  estado: 'SOL' | 'APR' | 'REC'
  estudiante: {
    id: number
    usuario: {
      nombre: string
      apellido: string
    }
  }
  archivo: string | null
}

export default function LicenciaPage() {
  const [licencias, setLicencias] = useState<Licencia[]>([])
  const [selected, setSelected] = useState<Licencia | null>(null)


  const fetchLicencias = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/licencias/listar/');
      console.log("✅ Licencias cargadas:", res.data);
      setLicencias(res.data);
    } catch (err) {
      console.error("❌ Error al cargar licencias:", err);
    }
  }



  useEffect(() => {
    fetchLicencias()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Licencias Estudiantiles</h1>
      <LicenciasTable data={licencias} onView={(licencia) => setSelected(licencia)} />
      {selected && (
        <LicenciaModal
          licencia={selected}
          onClose={() => setSelected(null)}
          onStatusChange={fetchLicencias}
        />
      )}
    </div>
  )
}
