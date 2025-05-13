import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const InspectResumenPDF = (datos) => {
  const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);

  const tableColumn = ["Inspector", "Tipo de procedimiento", "Cantidad"];
  const tableRows = datos.map((e) => [
    e.inspector,
    e.tipo_procedimiento,
    e.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default InspectResumenPDF;
