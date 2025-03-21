import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const RecursosCentralPDF = () => {
  const startMonth = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const dateNow = dayjs().format("YYYY-MM-DDTHH:mm");

  const [recursos, setRecursos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(startMonth);
  const [fechaFin, setFechaFin] = useState(dateNow);

  const doc = new jsPDF();
  doc.text("Resumen Recursos involucrados", 10, 10);
  let filtros = `Filtros aplicados:\n`;
  if (fechaInicio && fechaFin)
    filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
      "es-ES"
    )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

  doc.text(filtros, 10, 20);
  const tableColumn = ["Recursos involucrados", "Cantidad"];
  const tableRows = recursos.map((r) => [r.recurso, r.cantidad]);

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
  doc.output("dataurlnewwindow");
};

const resumenRecursos = async () => {
  try {
    const res = await fetch("http://localhost:3000/resumen_recursos_central?");
    let params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }
    if (!res.ok) {
      throw new Error("Error al enviar los datos al servidor");
    }

    const data = await res.json();
    //console.log(fecha);
    //setFilter(data);
    setRecursos(data);
    console.log("filtro", data);
  } catch (error) {
    console.log(error);
  }
};

export default RecursosCentralPDF;
