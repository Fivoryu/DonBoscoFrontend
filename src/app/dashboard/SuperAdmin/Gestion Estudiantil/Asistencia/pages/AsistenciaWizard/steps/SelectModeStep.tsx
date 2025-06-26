import ModeToggle from "../../../components/ModeToggle";

export default function SelectModeStep({ value, onChange }: { value?: "general" | "clase"; onChange: (tipo: "general" | "clase") => void }) {
  return (
    <div>
      <label className="block mb-2 font-semibold">Tipo de asistencia</label>
      <ModeToggle value={value} onChange={onChange} />
      <div className="text-sm text-gray-500 mt-2">
        Elija "General" para asistencia de entrada al colegio o "Por clase" para tomar lista por materia/curso.
      </div>
    </div>
  );
}
