import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  text: { fontSize: 14, marginBottom: 10 },
});

const CentralPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.text}>Este es el contenido del PDF</Text>
      </View>
    </Page>
  </Document>
);

export default CentralPDF;
