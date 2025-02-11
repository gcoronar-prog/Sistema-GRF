import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

function SGCImagenPDF() {
  const styles = StyleSheet.create({
    page: { padding: 20 },
    text: { fontSize: 14, marginBottom: 10 },
  });
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View>
          <Text style={styles.text}>Solicitud de imagen</Text>
        </View>
      </Page>
    </Document>
  );
}

export default SGCImagenPDF;
