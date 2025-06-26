import ActionCard from "../../../components/ActionCard";
import { FaPlusCircle, FaListAlt } from "react-icons/fa";

export default function SelectActionStep({ value, onChange }: { value?: "nueva" | "visualizar"; onChange: (accion: "nueva" | "visualizar") => void }) {
  return (
    <div>
      <label className="block mb-4 font-semibold text-lg">¿Qué desea hacer?</label>
      <div className="flex gap-4">
        <ActionCard
          icon={<FaPlusCircle />}
          title="Generar nueva asistencia"
          description="Registrar la asistencia de hoy para este curso."
          selected={value === "nueva"}
          onClick={() => onChange("nueva")}
        />
        <ActionCard
          icon={<FaListAlt />}
          title="Visualizar asistencia / porcentaje"
          description="Ver historial y estadísticas de asistencia."
          selected={value === "visualizar"}
          onClick={() => onChange("visualizar")}
        />
      </div>
    </div>
  );
}
