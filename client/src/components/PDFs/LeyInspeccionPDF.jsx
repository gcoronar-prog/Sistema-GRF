import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const LeyInspeccionPDF = (
  datos,
  fechaInicioInfrac,
  fechaFinInfrac,
  fechaInicioCitacion,
  fechaFinCitacion,
  fechaInicio,
  fechaFin
) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const addHeader = (title, subtitle = "") => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    if (subtitle) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, pageWidth / 2, 27, { align: "center" });
    }

    const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
    const logoSegPub = `${import.meta.env.VITE_LOGO_SEG}`;
    doc.addImage(logo, "PNG", 4, 3, 30, 15);
    doc.addImage(logoSegPub, "PNG", 167, 4, 40, 15);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  addHeader("Resumen por leyes", "");

  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha creación expedientes: ${formatDate(
      fechaInicio
    )} - ${formatDate(fechaFin)}\n`;
  if (fechaInicioInfrac && fechaFinInfrac)
    filtros += `Fecha Infracción: ${formatDate(
      fechaInicioInfrac
    )} - ${formatDate(fechaFinInfrac)}\n`;
  if (fechaInicioCitacion && fechaFinCitacion)
    filtros += `Fecha citación: ${formatDate(
      fechaInicioCitacion
    )} - ${formatDate(fechaFinCitacion)}\n`;

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(filtros, 14, 25);

  const tableColumn = ["Ley", "Tipo de procedimiento", "Juzgado", "Cantidad"];
  const tableRows = datos.map((e) => [
    e.ley,
    e.tipo_procedimiento,
    e.juzgado,
    e.cantidad,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 11, cellPadding: 3, lineWidth: 0.3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { halign: "center", cellWidth: 50 },
      1: { halign: "center", cellWidth: 35 },
      2: { halign: "center", cellWidth: 25 },
      3: { halign: "center", cellWidth: 25 },
    },
  });

  addFooter();
  doc.output("dataurlnewwindow");
};

export default LeyInspeccionPDF;
