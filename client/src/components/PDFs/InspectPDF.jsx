import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const InspectPDF = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_ROUTE_BACK}/expedi/${id}`
  );
  const data = await response.json();
  const expediente = data.expediente[0];

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
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, pageWidth / 2, 27, { align: "center" });
    }

    // Opcional: logotipo (si tienes uno en base64)
    // doc.addImage(logo, "PNG", margin, 10, 30, 15);
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
    ["N° Boleta/Control", expediente.num_control],
    ["Fecha documento", formatDate(expediente.fecha_resolucion)],
    ["Estado", expediente.estado_exp || "-"],
    ["Juzgado", expediente.juzgado || "-"],
    [
      {
        content: "Datos contribuyente",
        colSpan: 2,
        styles: {
          fontStyle: "bolditalic",
          fontSize: 14,
          font: "courier",
          fillColor: [228, 233, 247],
        },
      },
    ],
    ["Rut Contribuyente", expediente.rut_contri || "-"],
    ["Nombre Contribuyente", expediente.nombre || "-"],
    ["Rol Contribuyente", expediente.rol_contri || "-"],
    ["Giro Contribuyente", expediente.giro_contri || "-"],
    ["Dirección Contribuyente", expediente.direccion || "-"],
    [
      {
        content: "Datos Infracción",
        colSpan: 2,
        styles: {
          fontStyle: "bolditalic",
          fontSize: 14,
          font: "courier",
          fillColor: [228, 233, 247],
        },
      },
    ],
    ["Fecha de infracción", formatDate(expediente.fecha_infraccion) || "-"],
    ["Dirección infracción", expediente.direccion_infraccion || "-"],
    ["Sector infracción", expediente.sector_infraccion || "-"],
    ["Observaciones", expediente.observaciones || "-"],
    ["Fecha de citación", formatDate(expediente.fecha_citacion) || "-"],
    ["Ley que se aplica", expediente.ley || "-"],
    ["Glosa de ley", expediente.glosa_ley || "-"],
  ];

  autoTable(doc, {
    startY: 30,
    head: [
      [
        {
          content: "Datos de Expediente cód. " + expediente.id_expediente,
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

  const rows1 = [
    ["PPU", expediente.ppu || "-"],
    ["Marca", expediente.marca_vehi || "-"],
    ["Tipo", expediente.tipo_vehi || "-"],
    ["Color", expediente.color_vehi || "-"],
  ];
  if (expediente.ppu && expediente.ppu.length > 0) {
    doc.addPage();
    addHeader("Expediente Inspección Municipal", "Datos Vehiculo");
    autoTable(doc, {
      startY: 30,
      head: [
        [
          {
            content: "Datos vehículo de contribuyente",
            colSpan: 2,
            styles: { fontStyle: "bold", fontSize: 14 },
          },
        ],
      ],
      body: rows1,
      styles: { fontSize: 12, cellPadding: 3, lineWidth: 0.3 },
      headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: "center" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: margin, right: margin },
    });
  }

  addFooter();
  doc.output("dataurlnewwindow");
  /* 
  codigo reporte
  fecha y hora
  turno (pendiente)
  centralista (pendiente)
  
  clasificacion
  fuente de captura
  origen
  informante
  vehiculo si es que hay
  tripulantes si es que hay
  tipo de reporte
  direccion
  sector
  tipo de ubicacion 
  descripcion
  
  recursos involucrados
  otros recursos si es que hay
  resolucion (pendiente)

  acciones si es que aparecen
  
  */
};

export default InspectPDF;
