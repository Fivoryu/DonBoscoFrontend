import html2pdf from "html2pdf.js";
import { RefObject } from "react";

interface ExportarPDFButtonProps {
  refElemento: RefObject<HTMLDivElement>;
  nombreArchivo?: string;
}

export default function ExportarPDFButton({ refElemento, nombreArchivo }: ExportarPDFButtonProps) {
  const exportarPDF = () => {
    const elemento = refElemento.current;
    if (!elemento) {
      console.error("Elemento para exportar no encontrado");
      return;
    }

    const opt = {
      margin: 0.5,
      filename: nombreArchivo || "boletin_estudiante.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    try {
      html2pdf().set(opt).from(elemento).save();
    } catch (error) {
      console.error("❌ Error al generar PDF:", error);
    }
  };

  return (
    <button
      onClick={exportarPDF}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mt-4"
    >
      Exportar PDF
    </button>
  );
}
