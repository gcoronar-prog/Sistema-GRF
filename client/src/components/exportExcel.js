import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (data, filename) => {
  if (!data || data.lenght === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { booktype: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octect-stream" });

  saveAs(file, filename);
};
