import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (data, filename, formu) => {
  //agregar parametro para identificar entre central, inspeccion, etc
  if (!data || data.length === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  let flatData = {};
  if (formu === "central") {
    // Transforma los datos para aplanar los campos JSON
    flatData = data.map((item) => ({
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
    }));
  } else if (formu === "inspect") {
    flatData = data.map((item) => ({
      ID: item.id_exp || "-",
      Codigo: item.id_expediente || "-",
      Num_control: item.num_control || "-",
      Digitador: item.user_creador || "-",
      Tipo_proceso: item.tipo_procedimiento || "-",
      Estado: item.estado_exp || "-",
      Empadronado: item.empadronado || "-",
      Inspector: item.funcionario || "-",
      Testigo: item.testigo || "-",
      Fecha_infraccion:
        new Date(item.fecha_infraccion).toLocaleString("es-ES") || "-",
      Sector_infraccion: item.sector_infraccion || "-",
      Direccion_infra: item.direccion_infraccion || "-",
      Fecha_citacion: item.fecha_citacion || "-",
      Juzgado: item.juzgado || "-",
      Observacion: item.observaciones || "-",
      Rut_contribuyente: item.rut_contri || "-",
      Nombre_contribuyente: item.nombre || "-",
      Direccion_contribuyente: item.direccion || "-",
      Rol_contribuyente: item.rol_contri || "-",
      Giro_contribuyente: item.giro_contri || "-",
      Tipo_vehiculo: item.tipo_vehi || "-",
      Marca_vehiculo: item.marca_vehi || "-",
      Color_vehiculo: item.color_vehi || "-",
    }));
  } else if (formu === "SGC") {
    flatData = data.map((item) => ({
      ID: item.id_atencion_solicitud || "-",
      Código: item.cod_atencion_solicitud || "-",
      Fecha_solicitud:
        new Date(item.fecha_solicitud).toLocaleString("es-ES") || "-",
      Estado_solicitud: item.estado_solicitud || "-",
      Tipo_solicitud: item.tipo_solicitud || "-",
      Sector_solicitante: item.sector_solicitante || "-",
      Poblacion_solicitante: item.poblacion_solicitante || "-",
      Junta_vecinos: item.junta_vecinos || "-",
      Descripcion_solicitud: item.descripcion_solicitud || "-",
      Fecha_atencion:
        new Date(item.fecha_atencion).toLocaleString("es-ES") || "-",
      Acciones_realizadas: item.acciones_realizadas || "-",
      Funcionario_responsable: item.funcionario_responsable || "-",
    }));
  } else {
    console.error("Formulario no reconocido para exportar");
    return;
  }

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
