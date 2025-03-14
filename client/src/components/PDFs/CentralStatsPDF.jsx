import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableCellHeader: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "15px",
  },
  tableCell: {
    textAlign: "center",
    fontSize: "10px",
  },
});

const formatDate = (date) =>
  date ? dayjs(date).format("DD-MM-YYYY [Hora:] HH:mm") : "Fecha no disponible";

const Table = ({ data }) => (
  <View style={styles.table}>
    {/* Encabezado de la tabla */}
    <View style={styles.tableRow}>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Nro. Informe</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Fecha Informe</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Clasificación</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Fuente de captura</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Origen</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Informante</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Sector</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Descripción</Text>
      </View>
    </View>

    {/* Filas de la tabla */}
    {data &&
      data.map((row, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{row.id_informes_central}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {formatDate(row.fecha_informe)}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {row.clasificacion_informe?.label}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{row.captura_informe}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{row.origen_informe?.label}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {row.persona_informante?.label}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{row.sector_informe?.label}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{row.descripcion_informe}</Text>
          </View>
        </View>
      ))}
  </View>
);

const CentralStatsPDF = ({ data }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            Estadísticas Central Municipal
          </Text>
          <Table data={data?.informe || []} />
        </View>
      </Page>
    </Document>
  );
};

export default CentralStatsPDF;
