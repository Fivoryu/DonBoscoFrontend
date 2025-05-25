import { ReactNode } from "react";
import { X } from "lucide-react";

interface FormModalProps {
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  className?: string;
}

export default function FormModal({
  title,
  children,
  onCancel,
  onSubmit,
  submitLabel = "Guardar",
  className = ""
}: FormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative ${className} max-h-[90vh] overflow-auto`}>
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          {children}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
