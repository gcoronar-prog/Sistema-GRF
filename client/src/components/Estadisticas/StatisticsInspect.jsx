import dayjs from "dayjs";
import React, { useState } from "react";
import NavbarSGF from "../NavbarSGF";
import SelectLey from "../SelectLey";
import SelectInspect from "../SelectInspect";
import SelectVehContri from "../SelectVehContri";
import SelectSector from "../SelectSector";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

function StatisticsInspect() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const startDate = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const datenow = dayjs().format("YYYY-MM-DDTHH:mm");
  const defaultValues = {
    fechaInicioInfrac: startDate,
    fechaFinInfrac: datenow,
    fechaInicioCitacion: "",
    fechaFinCitacion: "",
    fechaInicio: "",
    fechaFin: "",

    estado_exp: "",
    tipo_proce: "",
    jpl: "",
    digitador: "",
    leyes: "",
    inspector: "",

    rut_contri: "",
    tipo_vehiculo: "",
    marca_vehiculo: "",
    sector_infrac: "",
  };

  const [inspeccion, setInspeccion] = useState([]);
  const [fechaInicioInfrac, setFechaInicioInfrac] = useState(startDate);
  const [fechaFinInfrac, setFechaFinInfrac] = useState(datenow);
  const [fechaInicioCitacion, setFechaInicioCitacion] = useState("");
  const [fechaFinCitacion, setFechaFinCitacion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoFilter, setEstadoFilter] = useState({
    pendiente: false,
    despachado: false,
    resuelto: false,
    nulo: false,
  });
  const [tipoProced, setTipoProced] = useState({
    notificacion: false,
    citacion: false,
    causas: false,
    solicitudes: false,
  });
  const [jplFilter, setJplFilter] = useState({ jpl1: false, jpl2: false });
  const [selectedLey, setSelectedLey] = useState([]);
  const [selectedInspect, setSelectedInspect] = useState([]);
  const [selectedVeh, setSelectedVeh] = useState([]);
  const [selectedTipoVeh, setSelectedTipoVeh] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);

  const fetchData = async () => {
    let url = `${server_back}/estadisticaInspeccion?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehi", JSON.stringify(selectedTipoVeh));
    }

    if (selectedVeh) {
      params.append("modelo_vehi", JSON.stringify(selectedVeh));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      generarPDF(data.expedientes);
    } catch (error) {
      console.error(error);
    }
  };

  const generarPDF = (dato) => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Expedientes Inspección Municipal", 10, 10);
    let filtros = `Filtros aplicados:\n`;
    if (fechaInicioInfrac && fechaFinInfrac)
      filtros += `Fecha: ${new Date(fechaInicioInfrac).toLocaleString(
        "es-ES"
      )} - ${new Date(fechaFinInfrac).toLocaleString("es-ES")}\n`;

    doc.text(filtros, 10, 20);
    const tableColumn = [
      "ID Expediente",
      "N° Control",
      "Fecha Infracción",
      "Fecha de Citación",
      "Rut contribuyente",
      "Nombre contribuyente",

      "Inspector",
      "Procedimiento",
      "Estado",
      "Dirección infraccion",
      "Sector",
    ];
    console.log(dato);
    const tableRows = dato.map((c) => [
      c.id_expediente,
      c.num_control,
      new Date(c.fecha_infraccion).toLocaleString("es-ES"),
      new Date(c.fecha_citacion).toLocaleString("es-ES"),
      c.rut_contri,
      c.nombre,
      c.funcionario,
      c.tipo_procedimiento,
      c.estado_exp,
      c.direccion_infraccion,
      c.sector_infraccion,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });
    doc.output("dataurlnewwindow");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, dataset, value } = e.target;

    if (dataset.type === "estado") {
      setEstadoFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("estado");
    } else if (dataset.type === "tipo") {
      setTipoProced((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("tipo");
    } else if (dataset.type === "jpl") {
      setJplFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("jpl");
      console.log(name, checked, value);
    }
  };

  return (
    <>
      <NavbarSGF />
      <hr />
      <div className="rangoFecha">
        <label htmlFor="">Fecha de inicio</label>
        <input
          type="datetime-local"
          name="fechaInicioInfrac"
          id=""
          onChange={(e) => setFechaInicioInfrac(e.target.value)}
          value={fechaInicioInfrac}
        />
        <label htmlFor="">Fecha de termino</label>
        <input
          type="datetime-local"
          name="fechaFinInfrac"
          id=""
          onChange={(e) => setFechaFinInfrac(e.target.value)}
          value={fechaFinInfrac}
        />
      </div>

      <div className="rangoFechaCitacion">
        <label htmlFor="">Fecha de inicio</label>
        <input
          type="datetime-local"
          name="fechaInicioCitacion"
          id=""
          onChange={(e) => setFechaInicioCitacion(e.target.value)}
          value={fechaInicioCitacion}
        />
        <label htmlFor="">Fecha de termino</label>
        <input
          type="datetime-local"
          name="fechaFinCitacion"
          id=""
          onChange={(e) => setFechaFinCitacion(e.target.value)}
          value={fechaFinCitacion}
        />
      </div>

      <div className="rangoFechaCreacion">
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

      <div className="estadoExped">
        <label htmlFor="estadoExp">Estados</label>

        <label htmlFor="">Pendiente</label>
        <input
          type="checkbox"
          name="pendiente"
          value="pendiente"
          id=""
          data-type="estado"
          onChange={handleCheckboxChange}
          checked={estadoFilter.pendiente || false}
        />
        <label htmlFor="">Despachado</label>
        <input
          type="checkbox"
          name="despachado"
          id=""
          value="despachado"
          data-type="estado"
          onChange={handleCheckboxChange}
          checked={estadoFilter.despachado || false}
        />
        <label htmlFor="">Resuelto</label>
        <input
          type="checkbox"
          name="resuelto"
          id=""
          value="penresueltodiente"
          data-type="estado"
          onChange={handleCheckboxChange}
          checked={estadoFilter.resuelto || false}
        />

        <label htmlFor="">Nulo</label>
        <input
          type="checkbox"
          name="nulo"
          id=""
          value="penresueltodiente"
          data-type="estado"
          onChange={handleCheckboxChange}
          checked={estadoFilter.nulo || false}
        />
      </div>

      <div className="tipoProced">
        <label htmlFor="tipoProced">Tipos de procedimientos</label>

        <label htmlFor="">Notificación</label>
        <input
          type="checkbox"
          name="notificacion"
          value="notificacion"
          id=""
          data-type="tipo"
          onChange={handleCheckboxChange}
          checked={tipoProced.notificacion || false}
        />
        <label htmlFor="">Causas JPL</label>
        <input
          type="checkbox"
          name="causas"
          id=""
          value="causas"
          data-type="tipo"
          onChange={handleCheckboxChange}
          checked={tipoProced.causas || false}
        />
        <label htmlFor="">Citación</label>
        <input
          type="checkbox"
          name="citacion"
          id=""
          value="citacion"
          data-type="tipo"
          onChange={handleCheckboxChange}
          checked={tipoProced.citacion || false}
        />

        <label htmlFor="">Solicitudes generales</label>
        <input
          type="checkbox"
          name="solicitudes"
          id=""
          value="solicitudes"
          data-type="tipo"
          onChange={handleCheckboxChange}
          checked={tipoProced.solicitudes || false}
        />
      </div>

      <div className="jpls">
        <label htmlFor="jpl">Juzgados</label>
        <label htmlFor="">JPL 1</label>
        <input
          type="checkbox"
          name="jpl1"
          id=""
          value="jpl1"
          data-type="jpl"
          onChange={handleCheckboxChange}
          checked={jplFilter.jpl1 || false}
        />
        <label htmlFor="">JPL 2</label>
        <input
          type="checkbox"
          name="jpl2"
          id=""
          value="jpl2"
          data-type="jpl"
          onChange={handleCheckboxChange}
          checked={jplFilter.jpl2 || false}
        />
      </div>

      <div name="leyes">
        <label htmlFor="">Leyes</label>
        <SelectLey selectedLey={selectedLey} setSelectedLey={setSelectedLey} />
      </div>

      <div name="inspectores">
        <label htmlFor="">Inspectores</label>
        <SelectInspect
          selectedInspect={selectedInspect}
          setSelectInspect={setSelectedInspect}
        />
      </div>

      <div name="contribuyente">
        <label htmlFor="">Rut Contribuyente</label>
        <input type="text" name="rut_contri" id="" />

        <br />
        <label htmlFor="">Marca Vehículo</label>
        <SelectVehContri
          selectedVeh={selectedVeh}
          setSelectVeh={setSelectedVeh}
          tipo={"marca"}
        />

        <label htmlFor="">Tipo de Vehículo</label>
        <SelectVehContri
          selectedVeh={selectedTipoVeh}
          setSelectVeh={setSelectedTipoVeh}
          tipo={"tipo"}
        />
        <label htmlFor="">Sector</label>
        <SelectSector
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
        />
      </div>

      <button onClick={fetchData}>Descargar PDF</button>
    </>
  );
}

export default StatisticsInspect;
