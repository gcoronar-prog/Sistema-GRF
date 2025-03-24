import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const RangoCentralPDF = (fechaInicio, fechaFin, rango) => {
  const doc = new jsPDF();
  doc.text("Resumen por Rango Horario", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = ["Rango Horario", "Clasificación", "Cantidad"];
  const tableRows = rango.map((r) => [
    r.rango_horario,
    r.clasificacion_informe,
    r.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default RangoCentralPDF;
