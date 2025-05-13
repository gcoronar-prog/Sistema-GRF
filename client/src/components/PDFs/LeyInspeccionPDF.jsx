import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const LeyInspeccionPDF = (datos) => {
  const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);

  const tableColumn = ["Ley", "Tipo de procedimiento", "Juzgado", "Cantidad"];
  const tableRows = datos.map((e) => [
    e.ley,
    e.tipo_procedimiento,
    e.juzgado,
    e.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default LeyInspeccionPDF;
