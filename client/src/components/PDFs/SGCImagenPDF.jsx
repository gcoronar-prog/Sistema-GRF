import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const SGCImagenPDF = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_ROUTE_BACK}/imagenes/seg/${id}/edit`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  const data = await response.json();
  const solicitud = data;

  console.log("solipdf", solicitud);
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 12;

  const formatDate = (date) => {
    if (!date) return "-";
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
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    if (subtitle) {
      doc.setFontSize(12);
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

  addHeader("Solicitud de Imagenes", "Datos solicitud");

  const rows = [
    //["Codigo solicitud", solicitud.cod_solicitud],
    ["Estado solicitud", solicitud.soliGrabacion[0].estado_solicitud],
    ["Fecha solicitud", formatDate(solicitud.soliUsuarios[0].fecha_solicitud)],
    ["Rut usuario", solicitud.soliUsuarios[0].rut_solicitante],
    ["Nombre usuario", solicitud.soliUsuarios[0].nombre_solicitante || "-"],
    ["Contacto", solicitud.soliUsuarios[0].telefono_solicitante || "-"],
    ["E-mail", solicitud.soliUsuarios[0].e_mail_solicitante || "-"],
    [
      {
        content: "Descripción responsable entrega imágenes",
        colSpan: 2,
        styles: {
          fontStyle: "bolditalic",
          fontSize: 14,
          font: "courier",
          fillColor: [228, 233, 247],
        },
      },
    ],
    [
      "Nombre responsable",
      solicitud.soliResponsable[0].nombre_responsable || "-",
    ],
    ["Rut responsable", solicitud.soliResponsable[0].rut_responsable || "-"],
    ["Institución", "I. Municipalidad de San Antonio"],
    [
      {
        content: "Datos solicitud",
        colSpan: 2,
        styles: {
          fontStyle: "bolditalic",
          fontSize: 14,
          font: "courier",
          fillColor: [228, 233, 247],
        },
      },
    ],
    [
      "Fecha grabación",
      formatDate(solicitud.soliGrabacion[0].fecha_siniestro) || "-",
    ],
    ["Sector", solicitud.soliGrabacion[0].sector_solicitud.label || "-"],
    ["Dirección", solicitud.soliGrabacion[0].direccion_solicitud || "-"],
    [
      "Descripción solicitud",
      solicitud.soliGrabacion[0].descripcion_solicitud || "-",
    ],

    ["Institución denuncia", solicitud.soliDenuncia[0].entidad || "-"],
    ["N° parte / documento", solicitud.soliDenuncia[0].num_parte || "-"],
  ];

  autoTable(doc, {
    startY: 30,
    head: [
      [
        {
          content: "Código solicitud: " + solicitud.solicitud[0].cod_solicitud,
          colSpan: 2,
          styles: { fontStyle: "bold", fontSize: 14 },
        },
      ],
    ],
    body: rows,
    styles: { fontSize: 12, cellPadding: 3, lineWidth: 0.3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: margin, right: margin },
  });

  addFooter();
  doc.output("dataurlnewwindow");
};

export default SGCImagenPDF;
