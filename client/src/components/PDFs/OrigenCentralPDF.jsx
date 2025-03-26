import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const OrigenCentralPDF = (fechaInicio, fechaFin, origen) => {
  const doc = new jsPDF();
  doc.text("Resumen por Origen", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = ["Origen", "Clasificación", "Captura", "Cantidad"];
  const tableRows = origen.map((c) => [
    c.origen,
    c.clasif,
    c.captura_informe,
    c.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default OrigenCentralPDF;
