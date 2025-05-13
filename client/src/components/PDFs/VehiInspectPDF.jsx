import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const VehiInspectPDF = (datos) => {
  const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);

  const tableColumn = ["Tipo de Vehículo", "Marca", "Cantidad"];
  const tableRows = datos.map((e) => [e.tipo_vehi, e.marca_vehi, e.cantidad]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

export default VehiInspectPDF;
