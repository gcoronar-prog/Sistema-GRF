import React, { useEffect, useState } from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";
import SelectRecursos from "../SelectRecursos";
import { BlobProvider } from "@react-pdf/renderer";
import CentralStatsPDF from "../PDFs/CentralStatsPDF";
import dayjs from "dayjs";
import EstadoCentralPDF from "../PDFs/EstadoCentralPDF";
import OrigenCentralPDF from "../PDFs/OrigenCentralPDF";
import ClasifCentralPDF from "../PDFs/ClasifCentralPDF";
import RecursosCentralPDF from "../PDFs/RecursosCentralPDF";
import RangoCentralPDF from "../PDFs/RangoCentralPDF";
import SelectClasifica from "../SelectClasifica";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

function StatisticsCentral() {
  const startMonth = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const dateNow = dayjs().format("YYYY-MM-DDTHH:mm");

  const defaultValues = {
    fechaInicio: startMonth,
    fechaFin: dateNow,
    estado: "",
    clasificacion: "",
    captura: "",
    origen: "",
    recursos: "",
    sector: "",
    vehiculo: "",
    centralista: "",
    tipoReporte: "",
  };

  const [central, setCentral] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(startMonth);
  const [fechaFin, setFechaFin] = useState(dateNow);
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState([]);
  const [selectedRecursos, setSelectedRecursos] = useState([]);
  const [selectedClasif, setSelectedClasif] = useState([]);
  const [clasif, setClasif] = useState("");
  const [clasifFilter, setClasifFilter] = useState(defaultValues);
  const [origenFilter, setOrigenFilter] = useState(defaultValues);
  const [estadoFilter, setEstadoFilter] = useState({
    atendido: false,
    progreso: false,
    pendiente: false,
  });
  const [recursosFilter, setRecursosFilter] = useState(defaultValues);
  const [rangoFilter, setRangoFilter] = useState(defaultValues);

  /*useEffect(() => {
    const formattedFechaI = dayjs(central.fechaInicio).format(
      "YYYY-MM-DDTHH:mm"
    );
    const formattedFechaF = dayjs(central.fechaFin).format("YYYY-MM-DDTHH:mm");

    const formattedData = {
      ...defaultValues,
      fechaInicio: formattedFechaI,
      fechaFin: formattedFechaF,
      estado: Object.keys(central.estado)
        .filter((key) => central.estado[key])
        .join(","),
      captura: Object.keys(central.captura)
        .filter((key) => central.captura[key])
        .join(","),
      clasificacion: selectedClasif,
      origen: selectedOrigen,
      sector: selectedSector,
      vehiculo: JSON.stringify(selectedVehiculo),
      tipoReporte: selectedTipo,
      recursos: JSON.stringify(selectedRecursos),
    };

    //console.log("recursos", central.captura);
    fetchData(formattedData);
    resumenClasif(formattedData);
    resumenOrigen(formattedData);
    resumenEstado(formattedData);
    resumenRecursos(formattedData);
    resumenRango(formattedData);
    //console.log("fecha", formattedFechas);
  }, []);

  /*useEffect(() => {
    const fetchAllData = async () => {
      const formattedFechaI = dayjs(central.fechaInicio).format(
        "YYYY-MM-DDTHH:mm"
      );
      const formattedFechaF = dayjs(central.fechaFin).format(
        "YYYY-MM-DDTHH:mm"
      );

      const formattedData = {
        ...defaultValues,
        fechaInicio: formattedFechaI,
        fechaFin: formattedFechaF,
        estado: Object.keys(central.estado)
          .filter((key) => central.estado[key])
          .join(","),
        captura: Object.keys(central.captura)
          .filter((key) => central.captura[key])
          .join(","),
        clasificacion: central.clasificacion,
        origen: selectedOrigen,
        sector: selectedSector,
        vehiculo: JSON.stringify(selectedVehiculo),
        tipoReporte: selectedTipo,
        recursos: JSON.stringify(selectedRecursos),
      };

      try {
        const [data1, data2, data3, data4, data5, data6] = await Promise.all([
          fetch("http://localhost:3000/estadisticaCentral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_clasif_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_origen_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_estado_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_recursos_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_rango_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
        ]);

        setFilter(data1);
        setClasifFilter(data2);
        setOrigenFilter(data3);
        setEstadoFilter(data4);
        setRecursosFilter(data5);
        setRangoFilter(data6);
       
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllData();
  }, [
    central,
    selectedOrigen,
    selectedSector,
    selectedVehiculo,
    selectedTipo,
    selectedRecursos,
  ]);*/

  const fetchData = async () => {
    let url = "http://localhost:3000/estadisticaCentral?";
    let params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((key) => {
      if (estadoFilter[key]) {
        params.append("estado", key);
      }
    });

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      setCentral(data.informe || []);
      console.log(data.informe);
    } catch (error) {
      console.log(error);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reportes Central Municipal", 10, 10);
    let filtros = `Filtros aplicados:\n`;
    if (fechaInicio && fechaFin)
      filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
        "es-ES"
      )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

    doc.text(filtros, 10, 20);
    const tableColumn = ["ID", "Fecha"];
    const tableRows = central.map((c) => [
      c.id_informes_central,
      new Date(c.fecha_informe).toLocaleString("es-ES"),
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
    doc.output("dataurlnewwindow");
  };

  const resumenRecursos = async (fecha) => {
    try {
      const res = await fetch(
        "http://localhost:3000/resumen_recursos_central",
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await res.json();
      //console.log(fecha);
      //setFilter(data);
      setRecursosFilter(data);
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }
  };

  const resumenClasif = async (fecha) => {
    try {
      const res = await fetch("http://localhost:3000/resumen_clasif_central", {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await res.json();
      //console.log(fecha);
      //setFilter(data);
      setClasifFilter(data);
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }
  };
  const resumenOrigen = async (fecha) => {
    try {
      const res = await fetch("http://localhost:3000/resumen_origen_central", {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await res.json();
      //console.log(fecha);
      //setFilter(data);
      setOrigenFilter(data);
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }
  };
  const resumenEstado = async (fecha) => {
    try {
      const res = await fetch("http://localhost:3000/resumen_estado_central", {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await res.json();
      //console.log(fecha);
      //setFilter(data);
      setEstadoFilter(data);
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }
  };
  const resumenRango = async (fecha) => {
    try {
      const res = await fetch("http://localhost:3000/resumen_rango_central", {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await res.json();
      //console.log(fecha);
      //setFilter(data);
      setRangoFilter(data);
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEstadoFilter((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div>
      <div className="rangoFecha">
        <label htmlFor="">Fecha de inicio</label>
        <input
          type="datetime-local"
          name="fechaInicio"
          id=""
          onChange={(e) => setFechaInicio(e.target.value)}
          value={fechaInicio}
        />
        <label htmlFor="">Fecha de termino</label>
        <input
          type="datetime-local"
          name="fechaFin"
          id=""
          onChange={(e) => setFechaFin(e.target.value)}
          value={fechaFin}
        />
      </div>

      <div className="estadoInforme">
        <label htmlFor="estado">Estados</label>

        <label htmlFor="">Atendido</label>
        <input
          type="checkbox"
          name="estado"
          value="atendido"
          id=""
          onChange={handleCheckboxChange}
          checked={estadoFilter.atendido}
        />
        <label htmlFor="">En progreso</label>
        <input
          type="checkbox"
          name="estado"
          id=""
          value="progreso"
          onChange={handleCheckboxChange}
          checked={estadoFilter.progreso}
        />
        <label htmlFor="">Pendiente</label>
        <input
          type="checkbox"
          name="estado"
          id=""
          value="pendiente"
          onChange={handleCheckboxChange}
          checked={estadoFilter.pendiente}
        />
      </div>

      {/*Tabla de datos central municipal*/}
      <table border="1" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Informe</th>
          </tr>
        </thead>
        <tbody>
          {central.map((c) => (
            <tr key={c.id_informes_central}>
              <td>{c.id_informes_central}</td>
              <td>{new Date(c.fecha_informe).toLocaleString("es-ES")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*
      <div className="clasiInforme">
        <label htmlFor="clasificacion">Clasificación</label>

        <SelectClasifica
          selectedClasif={selectedClasif}
          setSelectedClasif={setSelectedClasif}
        />
      </div>

      <div className="capturaInforme">
        <label htmlFor="radios">Radio</label>
        <input
          type="checkbox"
          name="captura"
          id="radios"
          value={"radios"}
          onChange={handleChanges}
          checked={central.captura.radios}
        />
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="checkbox"
          name="captura"
          id="telefono"
          value={"telefono"}
          onChange={handleChanges}
          checked={central.captura.telefono}
        />
        <label htmlFor="rrss">RRSS</label>
        <input
          type="checkbox"
          name="captura"
          id="rrss"
          value={"rrss"}
          onChange={handleChanges}
          checked={central.captura.rrss}
        />
        <label htmlFor="presencial">Presencial</label>
        <input
          type="checkbox"
          name="captura"
          id="presencial"
          value={"presencial"}
          onChange={handleChanges}
          checked={central.captura.presencial}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="checkbox"
          name="captura"
          id="email"
          value={"email"}
          onChange={handleChanges}
          checked={central.captura.email}
        />
      </div>

      <div className="origenInforme">
        <label htmlFor="">Origen:</label>
        <SelectOrigin
          selectedOrigin={selectedOrigen}
          setSelectedOrigin={setSelectedOrigen}
        />
      </div>

      <div className="sectorInforme">
        <label htmlFor="">Sector:</label>
        <SelectSector
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
        />
      </div>

      <div className="vechiculoInforme">
        <label htmlFor="">Vehículos:</label>
        <SelectVehiculo
          selectedVehiculo={selectedVehiculo}
          setSelectedVehiculo={setSelectedVehiculo}
        />
      </div>

      <div className="tipoReporte">
        <label htmlFor="">Tipo de informe:</label>
        <SelectTipo
          tipo={clasif}
          selectedTipo={selectedTipo}
          setSelectedTipo={setSelectedTipo}
        />
      </div>

      <div className="recursosInvolucrados">
        <label htmlFor="">Recursos</label>
        <SelectRecursos
          selectedRecursos={selectedRecursos}
          setSelectedRecursos={setSelectedRecursos}
        />
      </div>

        */}
      <button onClick={fetchData}>Buscar</button>
      <button onClick={generarPDF} disabled={central.length === 0}>
        Descargar PDF
      </button>
    </div>
  );
}

export default StatisticsCentral;
