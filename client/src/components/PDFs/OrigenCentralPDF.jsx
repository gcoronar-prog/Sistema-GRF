import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const OrigenCentralPDF = (fechaInicio, fechaFin, origen) => {
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

  const tableBody = [];

  origen.informe.forEach((grupo) => {
    grupo.datos.sort((a, b) => {
      if (a.captura === null) return -1;
      if (b.captura === null) return 1;
      return 0;
    });
    grupo.datos.forEach((c) => {
      if (c.captura === "Total captura") {
        return;
      }

      if (c.captura === null) {
        tableBody.push([
          {
            content: grupo.origen,
            colSpan: 2,
            styles: {
              fillColor: [230, 230, 230],
              textColor: 20,
              fontStyle: "bold",
              halign: "left",
            },
          },
          {
            content: c.cantidad.toString(),
            styles: {
              fillColor: [230, 230, 230],
              textColor: 20,
              fontStyle: "bold",
              halign: "center",
            },
          },
        ]);
      } else {
        tableBody.push([c.clasif, c.captura, c.cantidad.toString()]);
      }
    });
  });

  tableBody.push([
    {
      content: "Total de reportes",
      colSpan: 2,
      styles: {
        fillColor: [230, 230, 230],
        textColor: 20,
        fontStyle: "bold",
        halign: "left",
      },
    },
    {
      content: origen.informe.rowsCount(),
      colSpan: 1,
      styles: {
        fillColor: [230, 230, 230],
        textColor: 20,
        fontStyle: "bold",
        halign: "center",
      },
    },
  ]);

  addHeader("Resumen Origen Central Municipal", "");

  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${formatDate(fechaInicio)} - ${formatDate(fechaFin)}\n`;

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(filtros, 14, 25);

  const tableColumn = ["Clasificación", "Captura", "Cantidad"];

  autoTable(doc, {
    head: [tableColumn],
    body: tableBody,
    startY: 40,
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

export default OrigenCentralPDF;
