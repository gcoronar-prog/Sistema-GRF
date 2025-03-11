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

const Table = ({ data }) => {
  let estadoAnterior = null;

  return (
    <View style={styles.table}>
      {/* Encabezado de la tabla */}
      <View style={styles.tableRow}>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Estado</Text>
        </View>

        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Clasificación</Text>
        </View>

        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Tipo de informe</Text>
        </View>

        <View style={styles.tableColHeader}>
          <Text style={styles.tableCellHeader}>Cantidad</Text>
        </View>
      </View>

      {/* Filas de la tabla */}
      {data &&
        data.map((row, index) => {
          const mostarEstado = row.estado_informe !== estadoAnterior;
          estadoAnterior = row.estado_informe;

          return (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.estado_informe}</Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.clasificacion_informe}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.tipo_informe.label}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.cantidad}</Text>
              </View>
            </View>
          );
        })}
    </View>
  );
};

const EstadoCentralPDF = ({ data }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            Resumen reportes por Estado
          </Text>
          <Table data={data?.informe || []} />
        </View>
      </Page>
    </Document>
  );
};

export default EstadoCentralPDF;
