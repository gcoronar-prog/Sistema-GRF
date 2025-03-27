import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const formatDate = (date) =>
  date ? new Date(date).toLocaleString("es-ES") : "Fecha no disponible";

const CentralStatsPDF = ({ data }) => {
  const doc = new jsPDF();

  doc.text("Estadísticas Central", 10, 10);

  const tableColumn = [
    "Nro. Informe",
    "Fecha Informe",
    "Clasificación",
    "Fuente de captura",
    "Origen",
    "Informante",
    "Sector",
    "Descripción",
  ];

  autoTable(doc, {
    head: [tableColumn],
    body: data.map((row) => [
      row.id_informes_central,
      formatDate(row.fecha_informe),
      row.clasificacion_informe?.label,
      row.captura_informe,
      row.origen_informe?.label,
      row.persona_informante?.label,
      row.sector_informe?.label,
      row.descripcion_informe,
    ]),
    startY: 20,
  });

  doc.output("dataurlnewwindow");
};

export default CentralStatsPDF;
