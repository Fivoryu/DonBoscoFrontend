interface EstudianteInfoProps {
  estudiante: any;
}

export default function EstudianteInfo({ estudiante }: EstudianteInfoProps) {
  const usuario = estudiante.usuario || {};
  const curso = estudiante.curso?.nombre || "Sin curso";
  const unidad = estudiante.unidad?.nombre || "Sin unidad";

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-1">
      <h3 className="text-lg font-semibold">Información del Estudiante</h3>
      <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
      <p><strong>CI:</strong> {usuario.ci}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Curso:</strong> {curso}</p>
      <p><strong>Unidad Educativa:</strong> {unidad}</p>
    </div>
  );
}
