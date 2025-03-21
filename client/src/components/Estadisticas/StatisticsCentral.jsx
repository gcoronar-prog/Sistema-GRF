import React, { useState } from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";
import SelectRecursos from "../SelectRecursos";
import dayjs from "dayjs";
import SelectClasifica from "../SelectClasifica";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { exportExcel } from "../exportExcel.js";
import RecursosCentralPDF from "../PDFs/RecursosCentralPDF.jsx";
import ClasifCentralPDF from "../PDFs/ClasifCentralPDF.jsx";
import OrigenCentralPDF from "../PDFs/OrigenCentralPDF.jsx";

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

  const [clasifFilter, setClasifFilter] = useState(defaultValues);
  const [origenFilter, setOrigenFilter] = useState(defaultValues);
  const [recursosFilter, setRecursosFilter] = useState([]);
  const [estadoFilter, setEstadoFilter] = useState({
    atendido: false,
    progreso: false,
    pendiente: false,
  });
  const [capturaFilter, setCapturaFilter] = useState({
    radios: false,
    telefono: false,
    rrss: false,
    presencial: false,
    email: false,
  });

  const fetchData = async () => {
    let url = "http://localhost:3000/estadisticaCentral?";
    let params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado) => {
      if (estadoFilter[estado]) {
        params.append("estado", estado);
      }
    });

    Object.keys(capturaFilter).forEach((captura) => {
      if (capturaFilter[captura]) {
        params.append("captura", captura);
      }
    });

    if (selectedClasif) {
      params.append("clasificacion", JSON.stringify(selectedClasif));
    }

    if (selectedOrigen) {
      params.append("origen", JSON.stringify(selectedOrigen));
    }

    if (selectedSector) {
      params.append("sector", JSON.stringify(selectedSector));
    }

    if (selectedVehiculo) {
      params.append("vehiculo", JSON.stringify(selectedVehiculo));
    }

    if (selectedTipo) {
      params.append("tipoReporte", JSON.stringify(selectedTipo));
    }

    if (selectedRecursos) {
      params.append("recursos", JSON.stringify(selectedRecursos));
    }

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
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Reportes Central Municipal", 10, 10);
    let filtros = `Filtros aplicados:\n`;
    if (fechaInicio && fechaFin)
      filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
        "es-ES"
      )} - ${new Date(fechaFin).toLocaleString("es-ES")}\n`;

    doc.text(filtros, 10, 20);
    const tableColumn = [
      "ID",
      "Fecha",
      "Clasificación",
      "Origen",
      "Persona",
      "Fuente Captura",
      "Tipo de informe",
      "Descripción",
      "Sector",
      "Dirección",
    ];
    const tableRows = central.map((c) => [
      c.cod_informes_central,
      new Date(c.fecha_informe).toLocaleString("es-ES"),
      c.clasificacion_informe.label,
      c.origen_informe.label,
      c.persona_informante.label,
      c.captura_informe,
      c.tipo_informe.label,
      c.descripcion_informe,
      c.sector_informe.label,
      c.direccion_informe,
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });
    doc.output("dataurlnewwindow");
  };

  const resumenRecursosPDF = async () => {
    const url = "http://localhost:3000/resumen_recursos_central?";
    let params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      setRecursosFilter(data.informe || []);
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }

    RecursosCentralPDF(fechaInicio, fechaFin, recursosFilter);
  };

  const resumenClasifPDF = async () => {
    const url = "http://localhost:3000/resumen_clasif_central?";
    const params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      setClasifFilter(data.informe || []);
      console.log("filtroClasif", data.informe);
    } catch (error) {
      console.log(error);
    }

    ClasifCentralPDF(fechaInicio, fechaFin, clasifFilter);
  };

  const resumenOrigenPDF = async () => {
    const url = "http://localhost:3000/resumen_origen_central?";
    const params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      setOrigenFilter(data.informe);
      console.log("filtro origen", data.informe);
    } catch (error) {
      console.log(error);
    }

    OrigenCentralPDF(fechaInicio, fechaFin, origenFilter);
  };

  const resumenEstado = async () => {
    const url = "http://localhost:3000/resumen_estado_central?";
    const paramas = new URLSearchParams();

    try {
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
    const { name, checked, dataset, value } = e.target;

    if (dataset.type === "estado") {
      setEstadoFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("estado");
    } else if (dataset.type === "captura") {
      setCapturaFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("captura");
    }
    console.log(name, checked, value);
  };

  const handleClearFilter = () => {
    setFechaInicio(startMonth);
    setFechaFin(dateNow);
    setSelectedOrigen([]);
    setSelectedSector([]);
    setSelectedVehiculo([]);
    setSelectedTipo([]);
    setSelectedRecursos([]);
    setSelectedClasif([]);
    setEstadoFilter({
      atendido: false,
      progreso: false,
      pendiente: false,
    });
    setCapturaFilter({
      radios: false,
      telefono: false,
      rrss: false,
      presencial: false,
      email: false,
    });
    setCentral([]);
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
          name="atendido"
          value="atendido"
          id=""
          data-type="estado"
          onChange={handleCheckboxChange}
          checked={estadoFilter.atendido || false}
        />
        <label htmlFor="">En progreso</label>
        <input
          type="checkbox"
          name="progreso"
          id=""
          value="progreso"
          data-type="estado"
          onChange={handleCheckboxChange}
          checked={estadoFilter.progreso || false}
        />
        <label htmlFor="">Pendiente</label>
        <input
          type="checkbox"
          name="pendiente"
          id=""
          value="pendiente"
          data-type="estado"
          onChange={handleCheckboxChange}
          checked={estadoFilter.pendiente || false}
        />
      </div>

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
          name="radios"
          id=""
          value="radios"
          data-type="captura"
          onChange={handleCheckboxChange}
          checked={capturaFilter.radios || false}
        />
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="checkbox"
          name="telefono"
          id=""
          value="telefono"
          data-type="captura"
          onChange={handleCheckboxChange}
          checked={capturaFilter.telefono || false}
        />
        <label htmlFor="rrss">RRSS</label>
        <input
          type="checkbox"
          name="rrss"
          id=""
          value="rrss"
          data-type="captura"
          onChange={handleCheckboxChange}
          checked={capturaFilter.rrss || false}
        />
        <label htmlFor="presencial">Presencial</label>
        <input
          type="checkbox"
          name="presencial"
          id=""
          value="presencial"
          data-type="captura"
          onChange={handleCheckboxChange}
          checked={capturaFilter.presencial || false}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="checkbox"
          name="email"
          id=""
          value="email"
          data-type="captura"
          onChange={handleCheckboxChange}
          checked={capturaFilter.email || false}
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
          tipo={selectedClasif}
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

      {/*BOTONEEEEES! */}
      <button onClick={fetchData}>Buscar</button>
      <button onClick={generarPDF} disabled={central.length === 0}>
        Descargar PDF
      </button>
      <button onClick={resumenRecursosPDF} disabled={central.length === 0}>
        Recursos involucrados
      </button>
      <button onClick={resumenClasifPDF} disabled={central.length === 0}>
        Clasificación
      </button>
      <button onClick={resumenOrigenPDF} disabled={central.length === 0}>
        Origen
      </button>
      <button onClick={() => exportExcel(central, "Central.xlsx")}>
        Exportar a Excel
      </button>
      <button onClick={handleClearFilter}>Limpiar filtros</button>

      {/*Tabla de datos central municipal*/}
      {central.length > 0 ? (
        <table border="1" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha Informe</th>
              <th>Clasificación</th>
              <th>Origen</th>
              <th>Persona Informante</th>
              <th>Fuente de captura</th>
              <th>Tipo de informe</th>
              <th>Descripción</th>
              <th>Sector</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {central.map((c) => (
              <tr key={c.id_informes_central}>
                <td>{c.cod_informes_central}</td>
                <td>{new Date(c.fecha_informe).toLocaleString("es-ES")}</td>
                <td>{c.clasificacion_informe.label}</td>
                <td>{c.origen_informe.label}</td>
                <td>{c.persona_informante.label}</td>
                <td>{c.captura_informe}</td>
                <td>{c.tipo_informe.label}</td>
                <td>{c.descripcion_informe}</td>
                <td>{c.sector_informe.label}</td>
                <td>{c.direccion_informe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "No se hay datos para mostrar"
      )}

      {/*
 

      

      

      

      

      

      

        */}
    </div>
  );
}

export default StatisticsCentral;
