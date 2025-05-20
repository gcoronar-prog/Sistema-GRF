import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const InspectPDF = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_ROUTE_BACK}/expedi/${id}`
  );
  const data = await response.json();

  /*const recurso = data.informe[0].recursos_informe;
  const listRecurso = recurso.map((r) => r.label);*/
  //console.log(data.expediente[0]);
  //console.log("id pdf", data.informe[0].id_informes_central);
  const doc = new jsPDF();
  doc.text("Expediente Inspección Municipal", 10, 10);

  const tableColumn = [
    "N° Expediente",
    "N° Boleta/Control",
    "Fecha documento",
    "Estado",
    "Juzgado",
    "Rut Contribuyente",
    "Nombre Contribuyente",
    "Rol Contribuyente",
    "Giro Contribuyente",
    "Dirección Contribuyente",
    "Ley que se aplica",
    "Glosa de ley",
    "PPU",
    "Marca",
    "Tipo",
    "Color",
    "Dirección infracción",
    "Fecha de infracción",
    "Fecha de citación",
  ];

  let y = 40;
  const saltoLinea = 10;

  doc.text(`N° Expediente: ${data.expediente[0].id_expediente}`, 10, y);
  y += saltoLinea;
  doc.text(`N° Boleta/Control:  ${data.expediente[0].num_control}`, 10, y);
  y += saltoLinea;
  doc.text(`Fecha documento: ${data.expediente[0].fecha_resolucion}`, 10, y);
  y += saltoLinea;
  doc.text(`Estado Expediente: ${data.expediente[0].estado_exp}`, 10, y);
  y += saltoLinea;
  doc.text(`Juzgado: ${data.expediente[0].juzgado}`, 10, y);
  y += saltoLinea;
  doc.text(`Rut Contribuyente: ${data.expediente[0].rut_contri}`, 10, y);
  y += saltoLinea;
  doc.text(`Nombre Contribuyente: ${data.expediente[0].nombre}`, 10, y);
  y += saltoLinea;
  doc.text(`Rol Contribuyente: ${data.expediente[0].rol_contri}`, 10, y);
  y += saltoLinea;
  doc.text(`Giro Contribuyente: ${data.expediente[0].giro_contri}`, 10, y);
  y += saltoLinea;
  doc.text(`Dirección Contribuyente: ${data.expediente[0].giro_contri}`, 10, y);
  y += saltoLinea;
  doc.text(`Ley que se aplica: ${data.expediente[0].ley}`, 10, y);
  y += saltoLinea;
  doc.text(`Glosa de ley: ${data.expediente[0].glosa_ley}`, 10, y);
  y += saltoLinea;
  doc.text(`PPU: ${data.expediente[0].ppu}`, 10, y);
  y += saltoLinea;
  doc.text(`Marca: ${data.expediente[0].marca_vehi}`, 10, y);
  y += saltoLinea;
  doc.text(`Tipo: ${data.expediente[0].tipo_vehi}`, 10, y);
  y += saltoLinea;
  doc.text(`Color: ${data.expediente[0].color_vehi}`, 10, y);
  y += saltoLinea;
  doc.text(
    `Dirección infracción: ${data.expediente[0].direccion_infraccion}`,
    10,
    y
  );
  y += saltoLinea;
  doc.text(
    `Fecha de infracción: ${data.expediente[0].fecha_infraccion}`,
    10,
    y
  );
  y += saltoLinea;
  doc.text(`Fecha de citación: ${data.expediente[0].fecha_citacion}`, 10, y);
  y += saltoLinea;

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
