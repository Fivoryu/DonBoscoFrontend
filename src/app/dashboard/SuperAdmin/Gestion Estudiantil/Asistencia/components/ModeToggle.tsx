export default function ModeToggle({ value, onChange }: { value?: "general" | "clase"; onChange: (tipo: "general" | "clase") => void }) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        className={`px-4 py-2 rounded border ${value === "general" ? "bg-blue-600 text-white" : "bg-white"}`}
        onClick={() => onChange("general")}
      >
        General
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded border ${value === "clase" ? "bg-blue-600 text-white" : "bg-white"}`}
        onClick={() => onChange("clase")}
      >
        Por clase
      </button>
    </div>
  );
}
