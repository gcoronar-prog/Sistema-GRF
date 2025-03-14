import React from "react";
import dayjs from "dayjs";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    borderBottom: "2px solid #444",
    paddingBottom: 10,
  },
  section: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid #ddd",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: "#222",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid #ddd",
  },
  column: {
    flex: 1,
  },
  leftColumn: {
    paddingRight: 10,
  },
});

const formatDate = (date) =>
  date ? dayjs(date).format("DD-MM-YYYY [Hora:] HH:mm") : "Fecha no disponible";

const formatArray = (arr) =>
  Array.isArray(arr) && arr.length > 0
    ? arr.map((item) => item.label || item).join(", ")
    : "No hay registros";

const CentralPDF = ({
  data,
  recursos,
  vehiculos,
  tripulante,
  origen,
  informante,
  tipo,
  sector,
}) => {
  console.log("Datos recibidos en CentralPDF:", data);
  console.log("Recursos en PDF:", sector?.label);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Informe Central Municipal</Text>

        <View style={styles.rowContainer}>
          <View style={[styles.column, styles.leftColumn]}>
            <Text style={styles.label}>Id:</Text>
            <Text style={styles.value}>
              {data?.id_informes_central || "N/A"}
            </Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{formatDate(data?.fecha_informe)}</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.column, styles.leftColumn]}>
            <Text style={styles.label}>Origen:</Text>
            <Text style={styles.value}>
              {origen?.label || "No especificado"}
            </Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Informante:</Text>
            <Text style={styles.value}>
              {informante?.label || "No especificado"}
            </Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.column, styles.leftColumn]}>
            <Text style={styles.label}>Captura informe:</Text>
            <Text style={styles.value}>{data?.captura_informe || "N/A"}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Clasificación:</Text>
            <Text style={styles.value}>
              {data?.clasificacion_informe.label || "Sin clasificación"}
            </Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.column, styles.leftColumn]}>
            <Text style={styles.label}>Estado informe:</Text>
            <Text style={styles.value}>{data?.estado_informe || "N/A"}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Tipo informe:</Text>
            <Text style={styles.value}>{tipo?.label || "No especificado"}</Text>
          </View>
        </View>

        {
          (data.otro_tipo = "" ? (
            <View style={styles.section}>
              <Text style={styles.label}>Otro tipo informe:</Text>
              <Text style={styles.value}>
                {data?.otro_tipo || "No hay registro"}
              </Text>
            </View>
          ) : (
            ""
          ))
        }

        <View style={styles.rowContainer}>
          <View style={[styles.column, styles.leftColumn]}>
            <Text style={styles.label}>Sector:</Text>
            <Text style={styles.value}>
              {sector?.label || "No especificado"}
            </Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.value}>
              {data?.direccion_informe || "Sin dirección"}
            </Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.column, styles.leftColumn]}>
            <Text style={styles.label}>Vehículo/s utilizado/s:</Text>
            <Text style={styles.value}>{formatArray(vehiculos)}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Tripulantes:</Text>
            <Text style={styles.value}>{formatArray(tripulante)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Recursos involucrados:</Text>
          <Text style={styles.value}>{formatArray(recursos)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.value}>
            {data?.descripcion_informe || "No hay descripción"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CentralPDF;
