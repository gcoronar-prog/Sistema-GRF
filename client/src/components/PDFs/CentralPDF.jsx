import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const CentralPDF = async (id) => {
  const response = await fetch(`http://localhost:3000/informes_central/${id}`);
  const data = await response.json();

  const recurso = data.informe[0].recursos_informe;
  const listRecurso = recurso.map((r) => r.label);
  console.log("recursos central pdf", listRecurso);
  //console.log("id pdf", data.informe[0].id_informes_central);
  const doc = new jsPDF();
  doc.text("Informe Central Municipal", 10, 10);

  const tableColumn = [
    "Codigo Reporte",
    "Fecha y hora",
    "Clasificación",
    "Fuente de captura",
    "Origen",
    "Informante",
    "Vehiculo",
    "Tripulantes",
    "Tipo de reporte",
    "Direccion",
    "Sector",
    "Tipo de ubicacion",
    "Descripcion",
    "Recursos involucrados",
    "Otros recursos",
    "Acciones",
  ];

  let y = 40;
  const saltoLinea = 10;

  doc.text(`Codigo informe: ${data.informe[0].id_informes_central}`, 10, y);
  y += saltoLinea;
  doc.text(`Fecha y hora:  ${data.informe[0].fecha_informe}`, 10, y);
  y += saltoLinea;
  doc.text(
    `Clasificación: ${data.informe[0].clasificacion_informe.label}`,
    10,
    y
  );
  y += saltoLinea;
  doc.text(`Fuente de captura: ${data.informe[0].captura_informe}`, 10, y);
  y += saltoLinea;
  doc.text(`Origen: ${data.informe[0].origen_informe.label}`, 10, y);
  y += saltoLinea;
  doc.text(`Informante: ${data.informe[0].persona_informante.label}`, 10, y);
  y += saltoLinea;
  doc.text(`Vehiculo: ${data.informe[0].vehiculos_informe.label}`, 10, y);
  y += saltoLinea;
  doc.text(`Tripulantes: ${data.informe[0].tripulantes_informe.label}`, 10, y);
  y += saltoLinea;
  doc.text(`Tipo de reporte: ${data.informe[0].tipo_informe.label}`, 10, y);
  y += saltoLinea;
  doc.text(`Dirección: ${data.informe[0].direccion_informe}`, 10, y);
  y += saltoLinea;
  doc.text(`Sector: ${data.informe[0].sector_informe.label}`, 10, y);
  y += saltoLinea;
  doc.text(`Descripción: ${data.informe[0].descripcion_informe}`, 10, y);
  y += saltoLinea;
  doc.text(`Recursos involucrados: ${listRecurso}`, 10, y);

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

export default CentralPDF;
