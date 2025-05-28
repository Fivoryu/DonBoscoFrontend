import React, { useEffect, useState } from "react";
import AxiosInstance from "@/components/AxiosInstance";
import { Usuario } from "@/app/modelos/Usuarios";
import { Especialidad } from "@/app/modelos/Personal";
import { Estudiante, Tutor } from "@/app/modelos/Estudiantes";
import FormModal from "@/components/FormModal";

interface Props {
  initial: Usuario | null;
  onCancel: () => void;
  onSave: (updated: Usuario) => void;
}

const getRolNombreById = (id: number): string => {
  switch (id) {
    case 2:
      return "superadmin";
    case 3:
      return "admin";
    case 4:
      return "estudiante";
    case 5:
      return "profesor";
    case 6:
      return "tutor";
    default:
      return "";
  }
};

type FormType = Usuario & {
  especialidadId?: number;
  rude?: string;
  tutorCi?: string;
  tutorParentesco?: string;
  parentesco?: string;
  hijoCi?: string;
  puesto?: string;
};



export default function UsuarioFormModal({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<FormType>(
    // inicializa con los campos de Usuario + undefined para los extras
    initial
      ? { ...initial }
      : ({
          id: 0,
          ci: "",
          nombre: "",
          apellido: "",
          email: "",
          username: "",
          foto: null,
          fecha_nacimiento: "",
          rol: { id: 0, nombre: "" },
          password: null,
          estado: true,
          is_staff: false,
          is_active: true,
          date_joined: new Date().toISOString(),
          sexo: "",
          telefono: null,
          // campos extra quedan undefined
        } as FormType)
  );

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  useEffect(() => {
    if (form.rol.id === 5) {
      AxiosInstance.get<Especialidad[]>("/personal/especialidades/listar/").then(r => {
        setEspecialidades(r.data);
      });
    }
    if (form.rol.id === 4) {
      AxiosInstance.get<Tutor[]>("/estudiantes/tutores/").then(r => {
        setTutores(r.data);
      });
    }
    if (form.rol.id === 6) {
      AxiosInstance.get<Estudiante[]>("/estudiantes/estudiantes/listar").then(r => {
        setEstudiantes(r.data);
      });
    }
  }, [form.rol.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.currentTarget;
    setForm(f => ({
      ...f,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Agregas todos los campos simples
    formData.append("ci", form.ci);
    formData.append("nombre", form.nombre);
    formData.append("apellido", form.apellido);
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("rol_id", String(form.rol.id));

    if (form.especialidadId)   formData.append("especialidad_id", String(form.especialidadId));
    if (form.rude)             formData.append("rude", form.rude);
    if (form.tutorCi)          formData.append("tutor_ci", form.tutorCi);
    if (form.tutorParentesco)  formData.append("parentesco", form.tutorParentesco);
    if (form.hijoCi)           formData.append("hijo_ci", form.hijoCi);
    if (form.parentesco)       formData.append("parentesco", form.parentesco);
    if (form.puesto)           formData.append("puesto", form.puesto);
    if (form.password)      formData.append("password", form.password);
    if (form.telefono)      formData.append("telefono", form.telefono);
    if (form.fecha_nacimiento)
                            formData.append("fecha_nacimiento", form.fecha_nacimiento);
    if (form.sexo)          formData.append("sexo", form.sexo);
    if (form.foto && (form.foto as any) instanceof File)
                            formData.append("foto", form.foto);

    // ¡Clave! envia rol_id, no rol
    if (form.rol && form.rol.id) {
      formData.append("rol_id", form.rol.id.toString());
    }

    try {
      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(
          `/user/auth/usuarios/editar-usuario/${form.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        resp = await AxiosInstance.post(
          "/user/auth/usuarios/register/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      const nuevo = resp.data.user ?? resp.data;
      onSave(nuevo);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal 
      title={form.id ? "Editar Usuario" : "Nuevo Usuario"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      <div>
        <label className="block mb-1">CI</label>
        <input
          name="ci"
          value={form.ci}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Apellido</label>
        <input
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Usuario</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Contraseña</label>
        <input
          name="password"
          type="password"
          value={form.password ?? ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Teléfono</label>
        <input
          name="telefono"
          value={form.telefono ?? ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
          <label>Rol</label>
          <select
            name="rol"
            value={form.rol.id}
            onChange={e => {
              const id = Number(e.target.value);
              setForm(f => ({
                ...f,
                rol: { id, nombre: getRolNombreById(id).toLowerCase() },
                // limpia campos extra al cambiar rol
                especialidadId: undefined,
                rude: undefined,
                tutorCi: undefined,
                tutorParentesco: undefined,
                parentesco: undefined,
                hijoCi: undefined,
                puesto: undefined,
              }));
            }}
          >
            <option value="">— Selecciona —</option>
            <option value="2">SuperAdmin</option>
            <option value="3">Admin</option>
            <option value="4">Estudiante</option>
            <option value="5">Profesor</option>
            <option value="6">Tutor</option>
          </select>
        </div>

        {/* 5) Campos condicionales */}
        {/* PROFESOR */}
        {form.rol.id === 5 && (
          <div className="col-span-2">
            <label>Especialidad (opcional)</label>
            <select
              name="especialidadId"
              value={form.especialidadId ?? ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">— Selecciona —</option>
              {especialidades.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ESTUDIANTE */}
        {form.rol.id === 4 && (
          <>
            <div className="col-span-2">
              <label>RUDE</label>
              <input
                name="rude"
                value={form.rude ?? ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label>CI Tutor (opcional)</label>
              <select
                name="tutorCi"
                value={form.tutorCi ?? ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">— Selecciona —</option>
                {tutores.map(t => (
                  <option key={t.usuario.ci} value={t.usuario.ci}>
                    {t.usuario.ci}
                  </option>
                ))}
              </select>
              {form.tutorCi && (
                <p className="mt-1">
                  Nombre:{" "}
                  {
                    tutores.find(t => t.usuario.ci === form.tutorCi)!
                      .usuario.nombre
                  }{" "}
                  {
                    tutores.find(t => t.usuario.ci === form.tutorCi)!
                      .usuario.apellido
                  }
                </p>
              )}
            </div>
            {form.tutorCi && (
              <div>
                <label>Parentesco</label>
                <select
                  name="tutorParentesco"
                  value={form.tutorParentesco ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">— Selecciona —</option>
                  <option value="PAD">Padre</option>
                  <option value="MAD">Madre</option>
                  <option value="TUT">Tutor Legal</option>
                  <option value="HER">Hermano/a</option>
                  <option value="OTR">Otro</option>
                </select>
              </div>
            )}
          </>
        )}

        {/* TUTOR */}
        {form.rol.id === 6 && (
          <>
            <div>
              <label>CI Hijo</label>
              <select
                name="hijoCi"
                value={form.hijoCi ?? ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">— Selecciona —</option>
                {estudiantes.map(e => (
                  <option key={e.usuario.ci} value={e.usuario.ci}>
                    {e.usuario.ci}
                  </option>
                ))}
              </select>
              {form.hijoCi && (
                <p className="mt-1">
                  Nombre:{" "}
                  {
                    estudiantes.find(
                      e => e.usuario.ci === form.hijoCi
                    )!.usuario.nombre
                  }{" "}
                  {
                    estudiantes.find(
                      e => e.usuario.ci === form.hijoCi
                    )!.usuario.apellido
                  }
                </p>
              )}
            </div>
            <div>
              <label>Parentesco</label>
              <select
                name="parentesco"
                value={form.parentesco ?? ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">— Selecciona —</option>
                <option value="PAD">Padre</option>
                <option value="MAD">Madre</option>
                <option value="TUT">Tutor Legal</option>
                <option value="HER">Hermano/a</option>
                <option value="OTR">Otro</option>
              </select>
            </div>
          </>
        )}

        {/* ADMIN */}
        {form.rol.id === 3 && (
          <div className="col-span-2">
            <label>Puesto</label>
            <input
              name="puesto"
              value={form.puesto ?? ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        )}
    </FormModal>    
  );
}
