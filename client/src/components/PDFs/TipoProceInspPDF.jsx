import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const TipoProceInspPDF = (
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

  const tableBody = [];

  datos.expedientes.forEach((grupo) => {
    grupo.datos.sort((a, b) => {
      if (a.funcionarios === null) return -1;
      if (b.funcionarios === null) return 1;
      return 0;
    });
    grupo.datos.forEach((c) => {
      if (c.funcionarios === null) {
        tableBody.push([
          {
            content: grupo.procesos,
            colSpan: 1,
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
        tableBody.push([c.funcionarios, c.cantidad.toString()]);
      }
    });
    /*const subtotal = grupo.datos.reduce((sum, c) => sum + c.cantidad, 0);
    tableBody.push([
      {
        content: `Total ${grupo.procesos}`,
        colSpan: 1,
        styles: {
          fillColor: [230, 230, 230],
          fontStyle: "bold",
          halign: "right",
        },
      },
      {
        content: subtotal.toString(),
        styles: {
          fillColor: [230, 230, 230],
          fontStyle: "bold",
          halign: "center",
        },
      },
    ]);*/
  });

  addHeader("Resumen por Tipo de procedimiento", "");

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

  /*const tableRows = datos.map((e) => [
    e.tipo_procedimiento,
    e.funcionario,
    e.cantidad,
  ]);*/

  const totalProce = datos.total[0].count;

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
      content: totalProce,
      colSpan: 1,
      styles: {
        fillColor: [230, 230, 230],
        textColor: 20,
        fontStyle: "bold",
        halign: "center",
      },
    },
  ]);
  const tableColumn = ["Inspector", "Cantidad"];
  autoTable(doc, {
    head: [tableColumn],
    body: tableBody,
    startY: 40,
    styles: { fontSize: 14, cellPadding: 3, lineWidth: 0.3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
    },
  });

  addFooter();
  doc.output("dataurlnewwindow");
};

export default TipoProceInspPDF;
