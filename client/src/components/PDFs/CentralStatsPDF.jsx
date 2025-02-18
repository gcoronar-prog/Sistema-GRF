import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
function CentralStatsPDF() {
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
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      backgroundColor: "#f0f0f0",
      padding: 5,
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
    },
    tableCellHeader: {
      fontWeight: "bold",
      textAlign: "center",
    },
    tableCell: {
      textAlign: "center",
    },
  });

  const table = ({ data }) => (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Id Informe</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Fecha Informe</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Origen:</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Informante</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Fuente de captura</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Clasificación</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Estado Informe</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Tipo de Informe</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Sector</Text>
        </View>
        {/* tiene que ir id, fecha, clasificacion, fuente, origen, informante, direccion y descripcion */}
      </View>
    </View>
  );
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View>
          <Text style={styles.text}>Estadisticas Central Municipal</Text>
        </View>
      </Page>
    </Document>
  );
}

export default CentralStatsPDF;
