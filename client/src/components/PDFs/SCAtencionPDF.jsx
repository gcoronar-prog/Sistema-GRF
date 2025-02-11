import React from "react";
import { Document, Page, View, StyleSheet, Text } from "@react-pdf/renderer";

function SCAtencionPDF() {
  const styles = StyleSheet.create({
    page: { padding: 20 },
    text: { fontSize: 14, marginBottom: 10 },
  });
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View>
          <Text style={styles.text}>Informe de atencion al público</Text>
        </View>
      </Page>
    </Document>
  );
}

export default SCAtencionPDF;
