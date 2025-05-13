import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const SesctorInspectPDF = (datos) => {
  const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);

  const tableColumn = [
    "Sector infracción",
    "Inspector",
    "Tipo de procedimiento",
    "Cantidad",
  ];
  const tableRows = datos.map((e) => [
    e.sector_infraccion,
    e.inspector,
    e.tipo_procedimiento,
    e.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default SesctorInspectPDF;
