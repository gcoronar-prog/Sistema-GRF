import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const ClasifCentralPDF = (fechaInicio, fechaFin, origen) => {
  const doc = new jsPDF();
  doc.text("Resumen por Origen", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = [
    "Origen",
    "Clasificación",
    "Fuente de captura",
    "Cantidad",
  ];
  const tableRows = origen.map((o) => [
    o.origen_informe,
    o.clasificacion_informe,
    o.captura_informe,
    o.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default ClasifCentralPDF;
