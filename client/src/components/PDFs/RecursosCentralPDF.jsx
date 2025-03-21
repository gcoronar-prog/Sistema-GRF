import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const RecursosCentralPDF = (fechaInicio, fechaFin, recurso) => {
  const doc = new jsPDF();
  doc.text("Resumen Recursos involucrados", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = ["Recursos involucrados", "Cantidad"];
  const tableRows = recurso.map((r) => [r.recursos, r.cantidad]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default RecursosCentralPDF;
