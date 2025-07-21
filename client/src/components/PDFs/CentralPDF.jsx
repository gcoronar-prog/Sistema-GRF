import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Opcional: importar logo (base64)
// import logo from './logoBase64.js'; // si tienes un logotipo en base64

const CentralPDF = async (id) => {
  const server_back = `${import.meta.env.VITE_SERVER_ROUTE_BACK}`;
  const response = await fetch(`${server_back}/informes_central/${id}`);
  const data = await response.json();

  const informe = data.informe[0];
  const acciones = data.acciones;

  const recursos =
    informe.recursos_informe?.map((r) => r.label).join(", ") || "-";
  const otrosRecursos = informe.otros_recursos || "-";

  const vehiculos =
    informe.vehiculos_informe?.map((v) => v.label).join(", ") || "-";

  const tripulantes =
    informe.tripulantes_informe?.map((v) => v.label).join(", ") || "-";

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // === Función para encabezado ===
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

  // === Función para pie de página ===
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

  // === Página 1: Informe principal ===
  addHeader("Informe Central Municipal", "Datos generales del reporte");

  const rows = [
    ["Fecha y hora", formatDate(informe.fecha_informe)],
    ["Clasificación", informe.clasificacion_informe?.label || "-"],
    ["Fuente de captura", informe.captura_informe || "-"],
    ["Origen información", informe.origen_informe?.label || "-"],
    ["Informante", informe.persona_informante?.label || "-"],
    ["Vehículos utilizados", vehiculos],
    ["Tripulantes", tripulantes],
    ["Tipo de reporte", informe.tipo_informe?.label || "-"],
    ["Dirección evento", informe.direccion_informe || "-"],
    ["Sector evento", informe.sector_informe?.label || "-"],
    // ["Tipo de ubicación", informe.tipo_ubicacion || "-"],
    ["Descripción", informe.descripcion_informe || "-"],
    ["Recursos involucrados", recursos],
    ["Otros recursos", otrosRecursos],
  ];

  autoTable(doc, {
    startY: 35,
    head: [
      [
        {
          content: "Datos de Informe cód. " + informe.cod_informes_central,
          colSpan: 2,
        },
      ],
    ],
    body: rows,
    styles: { fontSize: 14, cellPadding: 3, lineWidth: 0.3 },
    headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: margin, right: margin },
  });

  // === Página 2: Acciones realizadas ===
  if (acciones && acciones.length > 0) {
    doc.addPage();
    addHeader("Acciones Realizadas", "Detalle cronológico de intervenciones");

    const accionesRows = acciones.map((accion) => [
      accion.cod_accion || "-",
      formatDate(accion.fecha_accion),
      accion.desc_acciones || "-",
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Código", "Fecha y hora", "Descripción"]],
      body: accionesRows,
      styles: { fontSize: 10, cellPadding: 3, lineWidth: 0.3 },
      headStyles: {
        fillColor: [39, 174, 96],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 110 },
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: margin, right: margin },
    });

    // === Pie de página ===
  }
  addFooter();

  // === Abrir PDF ===
  doc.output("dataurlnewwindow");
};

export default CentralPDF;
