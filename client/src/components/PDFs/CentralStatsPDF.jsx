import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const CentralStatsPDF = ({ data }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 12;

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addHeader = (title, subtitle = "") => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, pageWidth / 2, 27, { align: "center" });
    }
  };

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, 290, {
        align: "right",
      });
      doc.text(`Generado el: ${formatDate(new Date())}`, margin, 290);
    }
  };

  addHeader("Estadísticas Central Municipal", "Datos generales");

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
    head: [
      [
        {
          content: tableColumn,

          styles: { fontStyle: "bold", fontSize: 14 },
        },
      ],
    ],
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
    styles: { fontSize: 12, cellPadding: 3, lineWidth: 0.3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: margin, right: margin },
    startY: 20,
  });
  addFooter();
  doc.output("dataurlnewwindow");
};

export default CentralStatsPDF;
