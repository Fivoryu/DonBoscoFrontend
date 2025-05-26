import { useState, useEffect } from 'react';
import AxiosInstance from '@/components/AxiosInstance';
import { Plus } from 'lucide-react';

import { Colegio, UnidadEducativa } from '@/app/modelos/Institucion';
import { Admin } from '@/app/modelos/Usuarios';
import { FormState } from './components/UnidadFormModal';
import { SortConfig } from './components/UnidadesTable';

import UnidadFormModal from './components/UnidadFormModal';
import UnidadesTable from './components/UnidadesTable';

export default function SuperAdminUnidades() {
  const [rows, setRows] = useState<UnidadEducativa[]>([]);
  const [search, setSearch] = useState<string>('');
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [open, setOpen] = useState(false);
  const [editUnit, setEditUnit] = useState<UnidadEducativa | null>(null);

  const [sort, setSort] = useState<SortConfig>({
    key: 'nombre',
    asc: true,
  });

  // Cargas iniciales...
  useEffect(() => {
    AxiosInstance.get<Colegio[]>('/institucion/colegios/listar/')
      .then(r => setColegios(r.data));
    AxiosInstance.get<Admin[]>('/user/auth/usuarios/listar-admins/')
      .then(r => setAdmins(r.data));
    AxiosInstance.get<UnidadEducativa[]>('/institucion/unidades-educativas/listar/')
      .then(r => setRows(r.data));
  }, []);


  const handleSave = async (f: FormState) => {
    const payload = new FormData();
    payload.append('nombre', f.nombre);
    payload.append('codigo_sie', f.codigoSie);
    payload.append('turno', f.turno);
    payload.append('nivel', f.nivel);
    if (f.direccion) payload.append('direccion', f.direccion);
    if (f.telefono)  payload.append('telefono', f.telefono);
    if (f.adminId)   payload.append('admin_id', String(f.adminId));
    if (f.colegio) payload.append('colegio', String(f.colegio));

    try {
      if (editUnit) {
        // PUT para editar
        const res = await AxiosInstance.put<UnidadEducativa>(
          `/institucion/unidades-educativas/editar/${editUnit.id}/`,
          payload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setRows(rs => rs.map(r => r.id === editUnit.id ? res.data : r));
        alert('✅ Unidad actualizada');
      } else {
        // POST para crear
        const res = await AxiosInstance.post<UnidadEducativa>(
          '/institucion/crear-unidad-educativa/',
          payload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setRows(rs => [...rs, res.data]);
        alert('✅ Unidad creada');
      }
      setOpen(false);
      setEditUnit(null);
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data;
      const msg = detail
        ? Object.values(detail).flat().join('\n')
        : err.message;
      alert('❌ Error al guardar:\n' + msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta unidad educativa?')) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-unidad-educativa/${id}/`);
      setRows(rs => rs.filter(r => r.id !== id));
      alert('✅ Unidad eliminada');
    } catch (err) {
      console.error(err);
      alert('❌ Error al eliminar');
    }
  };

  const filteredRows = rows.filter(u => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return (
        u.nombre?.toLowerCase().includes(term) ||
        u.codigo_sie?.toLowerCase().includes(term) ||
        u.nivel?.toLowerCase().includes(term) 
      )
    }
  );

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">
          Unidades educativas
        </h2>
        <button
          onClick={() => {
            setEditUnit(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nueva unidad
        </button>
      </header>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, código SIE o nivel"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        </input>
      </div>

      <UnidadesTable
        rows={filteredRows}
        colegios={colegios}
        admins={admins}
        sort={sort}
        onToggleSort={k => setSort(s => ({ key: k, asc: s.key === k ? !s.asc : true }))}
        onEdit={u => {
          setEditUnit(u);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

<UnidadFormModal
  open={open}
  initial={
        editUnit
          ? {
              id: editUnit.id,
              nombre: editUnit.nombre  ?? '',      // nunca undefined
              codigoSie: editUnit.codigo_sie,       // siempre string
              turno: editUnit.turno,               // literal ok
              nivel: editUnit.nivel        ?? '',  // nunca undefined
              colegio: editUnit.colegio ?? null,
              direccion: editUnit.direccion ?? '',
              telefono: editUnit.telefono   ?? '',
              adminId: editUnit.adminId     ?? null,
            }
          : {
              nombre: '',
              codigoSie: '',
              turno: 'MAÑANA',
              nivel: '',
              colegio: null,
              direccion: '',
              telefono: '',
              adminId: null,
            }
      }
      colegios={colegios}
      admins={admins}
      onClose={() => setOpen(false)}
      onSave={handleSave}
    />
    </section>
  );
}
