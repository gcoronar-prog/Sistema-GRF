import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  text: { fontSize: 14, marginBottom: 10 },
});

const CentralPDF = ({ data, recursos, vehiculos }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.text}>Informe Central Municipal</Text>
        <Text style={styles.text}>Id: {data.id_informes_central}</Text>
        <Text style={styles.text}>Fecha informe: {data.fecha_informe}</Text>
        <Text style={styles.text}>Origen: {data.origen_informe}</Text>
        <Text style={styles.text}>Informante: {data.persona_informante}</Text>
        <Text style={styles.text}>Captura informe: {data.captura_informe}</Text>
        <Text style={styles.text}>
          Clasificación: {data.clasificacion_informe}
        </Text>
        <Text style={styles.text}>Estado informe: {data.estado_informe}</Text>
        <Text style={styles.text}>Tipo informe: {data.tipo_informe.label}</Text>
        <Text style={styles.text}>Otro tipo informe: {data.otro_tipo}</Text>
        <Text style={styles.text}>Descripcion: {data.descripcion_informe}</Text>
        <Text style={styles.text}>
          Recursos involucrados:
          {recursos.join(", ")}
        </Text>
        <Text style={styles.text}>Sector: {data.sector_informe}</Text>
        <Text style={styles.text}>Dirección: {data.direccion_informe}</Text>

        <Text style={styles.text}>
          Vehiculo/s utilizado/s:
          {JSON.parse(vehiculos)
            .map((item) => item.label)
            .join(", ")}
        </Text>
        <Text style={styles.text}>Tripulantes: {data.tripulantes_informe}</Text>
      </View>
      {console.log("Datos recibidos en CentralPDF:", data)}
      {console.log(
        "Recursos en PDF:",
        JSON.parse(vehiculos)
          .map((item) => item.label)
          .join(", ")
      )}
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
