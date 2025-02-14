import React from "react";
import dayjs from "dayjs";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  text: { fontSize: 14, marginBottom: 10 },
});

const CentralPDF = ({
  data,
  recursos,
  vehiculos,
  tripulante,
  origen,
  informante,
  tipo,
  sector,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.text}>Informe Central Municipal</Text>
        <Text style={styles.text}>Id: {data.id_informes_central}</Text>
        <Text style={styles.text}>
          Fecha:
          {dayjs(data.fecha_informe).format("DD-MM-YYYY [Hora:] HH:mm")}
        </Text>
        <Text style={styles.text}>Origen: {origen?.label}</Text>
        <Text style={styles.text}>Informante: {informante?.label}</Text>
        <Text style={styles.text}>Captura informe: {data.captura_informe}</Text>
        <Text style={styles.text}>
          Clasificación: {data.clasificacion_informe}
        </Text>
        <Text style={styles.text}>Estado informe: {data.estado_informe}</Text>
        <Text style={styles.text}>Tipo informe: {tipo?.label}</Text>
        <Text style={styles.text}>
          Otro tipo informe:
          {data.otro_tipo ? data.otro_tipo : "No hay registro"}
        </Text>
        <Text style={styles.text}>
          Descripcion:{" "}
          {data.descripcion_informe
            ? data.descripcion_informe
            : "No hay descripción"}
        </Text>
        <Text style={styles.text}>
          Recursos involucrados:
          {Array.isArray(recursos) ? recursos.join(", ") : "No hay registros"}
        </Text>
        <Text style={styles.text}>Sector: {sector?.label}</Text>
        <Text style={styles.text}>
          Dirección:{" "}
          {data.direccion_informe ? data.direccion_informe : "Sin dirección"}
        </Text>

        <Text style={styles.text}>
          Vehiculo/s utilizado/s:
          {Array.isArray(vehiculos)
            ? vehiculos.map((item) => item.label).join(", ")
            : "No hay registros"}
        </Text>
        <Text style={styles.text}>
          Tripulantes:
          {Array.isArray(tripulante)
            ? tripulante.map((item) => item.label).join(", ")
            : "No hay registros"}
        </Text>
      </View>
      {console.log("Datos recibidos en CentralPDF:", data)}
      {console.log("Recursos en PDF:", sector?.label)}
    </Page>
  </Document>
);
export default CentralPDF;
/*

//origen informe
    fecha_informe: "",
    origen_informe: "",
    persona_informante: "",
    captura_informe: "",
    clasificacion_informe: "",
    estado_informe: "",

    //tipos informe
    tipo_informe: "",
    otro_tipo: "",
    descripcion_informe: "",
    recursos_informe: "",

    //ubicacion informe

    sector_informe: "",
    direccion_informe: "",

    //datos vehiculos
    vehiculos_informe: "",
    tripulantes_informe: "",

    //informes
    id_informes_central: "",
    id_origen_informe: "",
    id_tipos_informe: "",
    id_ubicacion_informe: "",
    id_vehiculo_informe: "",
    */
