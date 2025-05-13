import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const GlosaInspectPDF = (datos) => {
  const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);

  const tableColumn = ["Tipo de procedimiento", "Glosa", "Ley", "Cantidad"];
  const tableRows = datos.map((e) => [
    e.tipo_procedimiento,
    e.glosa_ley,
    e.ley,
    e.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default GlosaInspectPDF;
