import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const estadoInspeccionPDF = (datos) => {
  const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);

  const tableColumn = ["Estado Expediente", "Tipo proceso", "Cantidad"];
  const tableRows = datos.map((e) => [
    e.estado_exp,
    e.tipo_procedimiento,
    e.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default estadoInspeccionPDF;
