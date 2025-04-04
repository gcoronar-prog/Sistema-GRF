import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const ClasifCentralPDF = (fechaInicio, fechaFin, clasi) => {
  const doc = new jsPDF();
  doc.text("Resumen por Clasificación", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = ["Clasificación", "Tipo de informe", "Cantidad"];
  const tableRows = clasi.map((c) => [c.clasif, c.tipo, c.cantidad]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default ClasifCentralPDF;
