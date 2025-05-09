import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const TipoProceInspPDF = (datos) => {
  console.log(datos);
  /*const doc = new jsPDF();
  doc.text("Resumen por Estado", 10, 10);

  const tableColumn = ["Tipo de proceso", "Inspector", "Cantidad"];
  const tableRows = datos.map((e) => [
    e.tipo_procedimiento,
    e.funcionario,
    e.cantidad,
  ]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");*/
};

export default TipoProceInspPDF;
