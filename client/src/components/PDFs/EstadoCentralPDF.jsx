import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const EstadoCentralPDF = (fechaInicio, fechaFin, estado) => {
  const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = [
    "Estado Informe",
    "Clasificación",
    "Tipo de informe",
    "Cantidad",
  ];
  const tableRows = estado.map((e) => [
    e.estado_informe,
    e.clasificacion_informe,
    e.tipo_informe,
    e.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default EstadoCentralPDF;
