import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (data, filename) => {
  //agregar parametro para identificar entre central, inspeccion, etc
  if (!data || data.length === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  // Transforma los datos para aplanar los campos JSON
  const flatData = data.map((item) => ({
    ID: item.id_informes_central || "-",
    Código: item.cod_informes_central || "-",
    Fecha: new Date(item.fecha_informe).toLocaleString("es-ES") || "-",
    Clasificación: item.clasificacion_informe?.label || "-",
    Captura: item.captura_informe || "-",
    Estado: item.estado_informe || "-",
    Origen: item.origen_informe?.label || "-",
    Persona: item.persona_informante?.label || "-",
    Rango: item.rango_horario || "-",
    Tipo_informe: item.tipo_informe?.label || "-",
    Otro_tipo: item.otro_tipo || "-",
    Descripcion: item.descripcion_informe || "-",
    Recursos: item.recursos_informe?.map((r) => r.label).join(", ") || "-",
    Direccion: item.direccion_informe || "-",
    Sector: item.sector_informe?.label || "-",
    Vehiculos: item.vehiculos_informe?.map((v) => v.label).join(", ") || "-",
    Tripulantes:
      item.tripulantes_informe?.map((t) => t.label).join(", ") || "-",
    // Agrega más campos si es necesario
  }));

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `${filename}`);
};
