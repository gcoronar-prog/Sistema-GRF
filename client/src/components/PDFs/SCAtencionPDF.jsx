import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const SCAtencionPDF = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_ROUTE_BACK}/aten/sgc/${id}`
  );
  const data = await response.json();
  const atenc_segciud = data.atencion_ciudadana[0];

  const response2 = await fetch(
    `${import.meta.env.VITE_SERVER_ROUTE_BACK}/acciones/seguridad/${id}`
    /*{
      "Content-Type": "application/json",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }*/
  );
  const data2 = await response2.json();
  if (data2.acciones.length !== 0) {
    const acciones = data2.acciones[0];
    console.log("acciones", acciones);
  } else {
    console.log("holi");
  }

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

  addHeader("Expediente Inspección Municipal", "Datos generales");

  const rows = [
    ["Fecha de solicitud/atención", formatDate(atenc_segciud.fecha_solicitud)],
    ["Responsable solicitud", atenc_segciud.responsable_solicitud || "-"],
    ["Modalidad de atención", atenc_segciud.medio_atencion || "-"],
    ["Tema atención", atenc_segciud.tema_atencion || "-"],
    [
      {
        content: "Datos usuario",
        colSpan: 2,
        styles: {
          fontStyle: "bolditalic",
          fontSize: 14,
          font: "courier",
          fillColor: [228, 233, 247],
        },
      },
    ],
    ["Nombre usuario", atenc_segciud.nombre_solicitante || "-"],
    ["Rut usuario", atenc_segciud.rut_solicitante || "-"],
    ["Teléfono", atenc_segciud.telefono_solicitante || "-"],
    ["E-mail", atenc_segciud.correo_solicitante || "-"],
    ["Dirección residencia", atenc_segciud.direccion_solicitante || "-"],
    ["Sector", atenc_segciud.sector_solicitante.label || "-"],
    ["Población", atenc_segciud.poblacion_solicitante.label || "-"],
    ["JJ.VV", atenc_segciud.junta_vecinos.label || "-"],
  ];

  const rows3 = [
    [
      {
        content: "Detalles Solicitud",
        colSpan: 1,
        styles: {
          fontStyle: "bolditalic",
          fontSize: 14,
          font: "courier",
          fillColor: [228, 233, 247],
        },
      },
    ],

    [
      "Descripción de la solicitud: " + atenc_segciud.descripcion_solicitud ||
        "-",
    ],

    ["Observaciones: " + atenc_segciud.observaciones_solicitud || "-"],
  ];

  autoTable(doc, {
    startY: 30,
    head: [
      [
        {
          content: "Datos de Solicitud cód. " + atenc_segciud.cod_atencion,
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

  autoTable(doc, {
    body: rows3,
    styles: { fontSize: 12, cellPadding: 3, lineWidth: 0.3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: margin, right: margin },
  });

  const rows1 = [
    ["Código acción", acciones.cod_accion],
    ["Fecha y hora", formatDate(acciones.fecha_accion) || "-"],
    ["Descripción", acciones.desc_acciones || "-"],
  ];
  if (acciones && acciones.length > 0) {
    doc.addPage();
    addHeader("Acciones realizadas", "");
    autoTable(doc, {
      startY: 30,
      head: [
        [
          {
            content: "Acciones",
            colSpan: 2,
            styles: { fontStyle: "bold", fontSize: 14 },
          },
        ],
      ],
      body: rows1,
      styles: { fontSize: 12, cellPadding: 3, lineWidth: 0.3 },
      headStyles: {
        fillColor: [39, 174, 96],
        textColor: 255,
        halign: "center",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: margin, right: margin },
    });
  } else {
    ("No hay acciones registradas para esta atención.");
  }

  addFooter();
  doc.output("dataurlnewwindow");
};

export default SCAtencionPDF;
