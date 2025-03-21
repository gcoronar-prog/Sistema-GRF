import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const OrigenCentralPDF = (fechaInicio, fechaFin, origen) => {
  const doc = new jsPDF();
  doc.text("Resumen por Clasificación", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = ["Clasificación", "Tipo de informe", "Cantidad"];
  const tableRows = origen.map((c) => [
    c.clasificacion_informe,
    c.tipo_informe,
    c.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default OrigenCentralPDF;
