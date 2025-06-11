import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import { Estudiante } from "@/app/modelos/Estudiantes";
import {
  getCursos,
  getUnidadesEducativas,
  crearEstudiante,
  editarEstudiante
} from "@/app/helpers/estudiantesHelpers";
import { Curso } from "@/app/modelos/Academico";
import { UnidadEducativa } from "@/app/modelos/Institucion";
import AxiosInstance from "@/components/AxiosInstance";
import { Usuario } from "@/app/modelos/Usuarios";

interface Props {
  open: boolean;
  onClose: () => void;
  modoEdicion: boolean;
  estudianteActual: Estudiante | null;
  onSave: (nuevo: Estudiante) => void;
}

export default function EstudianteFormModal({
  open,
  onClose,
  modoEdicion,
  estudianteActual,
  onSave
}: Props) {
  const [form, setForm] = useState({
    id: 0,
    usuario_id: 0,
    ci: "",
    nombre: "",
    apellido: "",
    sexo: "M",
    email: "",
    username: "",
    password: "",
    rude: "",
    curso_id: 0,
    unidad_id: 0
  });

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);

  useEffect(() => {
    console.log("📚 Cargando cursos y unidades educativas...");
    getCursos().then(setCursos);
    getUnidadesEducativas().then(setUnidades);
  }, []);

  useEffect(() => {
    if (!open) return;

    console.log("🟢 Modal abierto");
    console.log("👁️ Modo edición:", modoEdicion);
    console.log("🎯 Estudiante actual:", estudianteActual);

    if (modoEdicion && estudianteActual) {
      const e = estudianteActual;
      setForm({
        id: e.id!,
        usuario_id: e.usuario.id,
        ci: e.usuario.ci,
        nombre: e.usuario.nombre,
        apellido: e.usuario.apellido,
        sexo: e.usuario.sexo,
        email: e.usuario.email,
        username: e.usuario.username,
        password: "",
        rude: e.rude,
        curso_id: e.curso?.id || 0,
        unidad_id: e.unidad?.id || 0
      });
    } else {
      console.log("🆕 Preparando formulario para nuevo estudiante...");
      setForm({
        id: 0,
        usuario_id: 0,
        ci: "",
        nombre: "",
        apellido: "",
        sexo: "M",
        email: "",
        username: "",
        password: "",
        rude: "",
        curso_id: 0,
        unidad_id: 0
      });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    const isNew = form.id === 0;
    console.log(isNew ? "📝 Creando nuevo estudiante..." : "✏️ Editando estudiante existente...");

    const usuarioPayload: any = {
      ci: form.ci,
      nombre: form.nombre,
      apellido: form.apellido,
      sexo: form.sexo,
      email: form.email,
      username: form.username,
      unidad_id: form.unidad_id
    };

    
      let usuarioId: number;

      if (isNew) {
        usuarioPayload.password = form.password;
        usuarioPayload.rol_id = 4;
        usuarioPayload.rude = form.rude;

        console.log("📤 Enviando payload de usuario para registro:", usuarioPayload);
        const res = await AxiosInstance.post("/user/auth/usuarios/register/", usuarioPayload);
        usuarioId = res.data.user?.id || res.data.id;
        console.log("✅ Usuario creado con ID:", usuarioId);
      } else {
        usuarioId = form.usuario_id;
        console.log("📤 Enviando payload de usuario para edición:", usuarioPayload);
        await AxiosInstance.put(`/user/auth/usuarios/${usuarioId}/editar/`, usuarioPayload);
        console.log("✅ Usuario actualizado.");
      }

      const payloadEstudiante = {
        usuario_id: usuarioId,
        rude: form.rude,
        estado: true,
        curso_id: form.curso_id,
        unidad_id: form.unidad_id
      };

      console.log("📦 Payload estudiante:", payloadEstudiante);

      if (isNew) {
        await crearEstudiante(payloadEstudiante);
        console.log("✅ Estudiante creado.");
      } else {
        await editarEstudiante(form.id, payloadEstudiante);
        console.log("✅ Estudiante editado.");
      }

      // 🔧 Construir el objeto Estudiante manualmente para evitar error de tipo
      const usuarioObj = new Usuario({
        id: usuarioId,
        ci: form.ci,
        foto: null,
        nombre: form.nombre,
        apellido: form.apellido,
        sexo: form.sexo,
        email: form.email,
        fecha_nacimiento: null,
        username: form.username,
        estado: true,
        rol: { id: 4, nombre: "Estudiante" }, // puedes ajustar esto según tu sistema
        telefono: null,
        password: "",
        is_staff: false,
        is_active: true,
        date_joined: new Date().toISOString(),
        puesto: undefined
      });

      const estudianteObj: Estudiante = {
        id: isNew ? Date.now() : form.id,
        usuario: usuarioObj,
        rude: form.rude,
        estado: true,
        curso: cursos.find(c => c.id === form.curso_id) || undefined,
        unidad: unidades.find(u => u.id === form.unidad_id)!
      };

      console.log("📥 Estudiante listo para guardar en frontend:", estudianteObj);
      onSave(estudianteObj);
    
  };


  return (
    <FormModal
      title={modoEdicion ? "Editar Estudiante" : "Nuevo Estudiante"}
      onCancel={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <input name="ci" value={form.ci} onChange={handleChange} placeholder="CI" className="border p-2 rounded" />
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" />
        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="border p-2 rounded" />
        <select name="sexo" value={form.sexo} onChange={handleChange} className="border p-2 rounded">
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
        <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" className="border p-2 rounded" />
        {!modoEdicion && (
          <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" className="border p-2 rounded" type="password" />
        )}
        <input
          name="rude"
          value={form.rude}
          onChange={handleChange}
          placeholder="RUDE"
          className="border p-2 rounded col-span-2"
        />
        <select name="curso_id" value={form.curso_id} onChange={handleChange} className="border p-2 rounded col-span-2">
          <option value={0}>-- Seleccione curso --</option>
          {cursos.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select name="unidad_id" value={form.unidad_id} onChange={handleChange} className="border p-2 rounded col-span-2">
          <option value={0}>-- Seleccione unidad educativa --</option>
          {unidades.map(u => (
            <option key={u.id} value={u.id}>{u.nombre} ({u.colegio?.nombre})</option>
          ))}
        </select>
      </div>
    </FormModal>
  );
}
