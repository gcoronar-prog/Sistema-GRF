import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const EstadoCentralPDF = (datos, fechaInicio, fechaFin) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const addHeader = (title, subtitle = "") => {
    const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
    const logoSegPub = `${import.meta.env.VITE_LOGO_SEG}`;
    doc.addImage(logo, "PNG", 4, 3, 30, 15);
    doc.addImage(logoSegPub, "PNG", 167, 4, 40, 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    if (subtitle) {
      doc.setFontSize(11);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  addHeader("Resumen Estado Central Municipal", "");
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${formatDate(fechaInicio)} - ${formatDate(fechaFin)}\n`;

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(filtros, 14, 25);

  const tableColumn = ["Clasificación", "Tipo de informe", "Cantidad"];
  /*const tableRows = estado.map((e) => [
    e.estado_informe,
    e.clasif,
    e.tipo,
    e.cantidad,
  ]);*/
  const tableBody = [];

  datos.informe.forEach((grupo) => {
    grupo.datos.sort((a, b) => {
      if (a.clasif === null) return -1;
      if (b.clasif === null) return 1;
      return 0;
    });
    grupo.datos.forEach((c) => {
      if (c.clasif === null) {
        tableBody.push([
          {
            content: grupo.estado,
            colSpan: 2,
            styles: {
              fillColor: [230, 230, 230],
              fontStyle: "bold",
              halign: "left",
            },
          },
          {
            content: c.cantidad.toString(),
            styles: {
              fillColor: [230, 230, 230],
              fontStyle: "bold",
              halign: "center",
            },
          },
        ]);
      } else if (c.clasif !== null && c.tipo !== null) {
        // fila normal
        tableBody.push([c.tipo, c.clasif, c.cantidad.toString()]);
      }
    });
  });

  const totalEstado = datos.total[0].count;

  tableBody.push([
    {
      content: "Total expedientes",
      colSpan: 2,
      styles: {
        fillColor: [230, 230, 230],
        textColor: 20,
        fontStyle: "bold",
        halign: "left",
      },
    },
    {
      content: totalEstado,
      colSpan: 1,
      styles: {
        fillColor: [230, 230, 230],
        textColor: 20,
        fontStyle: "bold",
        halign: "center",
      },
    },
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableBody,
    startY: 40,
    tableWidth: "full",
    styles: { fontSize: 14, cellPadding: 3, lineWidth: 0.3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: margin, right: margin },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
    },
  });
  addFooter();
  doc.output("dataurlnewwindow");
};

export default EstadoCentralPDF;
