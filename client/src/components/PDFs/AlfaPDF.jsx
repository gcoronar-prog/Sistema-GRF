import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

function AlfaPDF() {
  const styles = StyleSheet.create({
    page: { padding: 20 },
    text: { fontSize: 14, marginBottom: 10 },
  });
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View>
          <Text style={styles.text}>Informe Alfa</Text>
        </View>
      </Page>
    </Document>
  );
}

export default AlfaPDF;
