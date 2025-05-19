import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import NavbarSGF from "../NavbarSGF";
import SelectLey from "../SelectLey";
import SelectInspect from "../SelectInspect";
import SelectVehContri from "../SelectVehContri";
import SelectSector from "../SelectSector";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import estadoInspeccionPDF from "../PDFs/estadoInspeccionPDF";
import TipoProceInspPDF from "../PDFs/TipoProceInspPDF";
import LeyInspeccionPDF from "../PDFs/LeyInspeccionPDF";
import InspectResumenPDF from "../PDFs/InspectResumenPDF";
import VehiInspectPDF from "../PDFs/VehiInspectPDF";
import SesctorInspectPDF from "../PDFs/SectorInspectPDF";
import GlosaInspectPDF from "../PDFs/GlosaInspectPDF";
import { exportExcel } from "../exportExcel";

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
  const [selectedLey, setSelectedLey] = useState("");
  const [selectedInspect, setSelectedInspect] = useState("");
  const [selectedVeh, setSelectedVeh] = useState("");
  const [selectedTipoVeh, setSelectedTipoVeh] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  //const [tipoDoc, setTipoDoc] = useState(0);

  const fetchData = async (tipoDoc) => {
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();

      if (data.expedientes.length !== 0) {
        if (tipoDoc === 1) {
          generarPDF(data.expedientes);
        } else if (tipoDoc === 2) {
          exportExcel(data.expedientes, "Expedientes.xlsx");
        }
      } else {
        alert("No hay datos para mostrar");
      }

      //exportExcel(data.expedientes, "Expedientes.xlsx");
      setInspeccion(data.expedientes);
      console.log(data);
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

  const resumenEstadoInsp = async () => {
    const url = "http://localhost:3000/resumen_estado_inspe?";
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        estadoInspeccionPDF(data.expedientes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenTipoExp = async () => {
    const url = "http://localhost:3000/resumen_tipo_inspe?";
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        TipoProceInspPDF(data.expedientes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenLeyInspec = async () => {
    const url = "http://localhost:3000/resumen_ley_inspe?";
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        LeyInspeccionPDF(data.expedientes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenInspector = async () => {
    const url = "http://localhost:3000/resumen_inspector_inspe?";
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        InspectResumenPDF(data.expedientes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenVehi = async () => {
    const url = "http://localhost:3000/resumen_vehi_inspe?";
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        VehiInspectPDF(data.expedientes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenSector = async () => {
    const url = "http://localhost:3000/resumen_sector_inspe?";
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        SesctorInspectPDF(data.expedientes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenGlosa = async () => {
    const url = "http://localhost:3000/resumen_glosa_inspe?";
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
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        GlosaInspectPDF(data.expedientes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFilter = () => {
    setFechaInicioInfrac(startDate);
    setFechaFinInfrac(datenow);
    setFechaInicioCitacion("");
    setFechaFinCitacion("");
    setFechaInicio("");
    setFechaFin("");

    setSelectedSector("");
    setSelectedInspect("");
    setSelectedTipoVeh("");
    setSelectedVeh("");
    setSelectedLey("");
    setEstadoFilter({
      pendiente: false,
      despachado: false,
      resuelto: false,
      nulo: false,
    });
    setTipoProced({
      notificacion: false,
      citacion: false,
      causas: false,
      solicitudes: false,
    });
    setJplFilter({ jpl1: false, jpl2: false });
    setInspeccion([]);
  };

  return (
    <>
      <NavbarSGF />
      <hr />
      <div className="card">
        <div className="card-header text-bg-success">
          <span className="fw-bold">Estadisticas Inspección Municipal</span>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="card m-3" name="fechasInfraccion">
                <div className="card-header">
                  <span className="fw-bold">Fechas de infracción</span>
                </div>
                <div className="card-body">
                  <div name="rangoFecha" className="">
                    <label htmlFor="fechaInicioInfrac" className="form-label">
                      Inicio
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fechaInicioInfrac"
                      id="fechaInicioInfrac"
                      onChange={(e) => setFechaInicioInfrac(e.target.value)}
                      value={fechaInicioInfrac}
                    />

                    <label htmlFor="fechaFinInfrac" className="form-label">
                      Término
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fechaFinInfrac"
                      id=""
                      onChange={(e) => setFechaFinInfrac(e.target.value)}
                      value={fechaFinInfrac}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card m-3" name="fechasCitacion">
                <div className="card-header">
                  <span className="fw-bold">Fechas de citación</span>
                </div>
                <div className="card-body">
                  <div className="rangoFechaCitacion">
                    <label htmlFor="fechaInicioCitacion" className="form-label">
                      Inicio
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fechaInicioCitacion"
                      id=""
                      onChange={(e) => setFechaInicioCitacion(e.target.value)}
                      value={fechaInicioCitacion}
                    />

                    <label htmlFor="fechaFinCitacion" className="form-label">
                      Término
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fechaFinCitacion"
                      id=""
                      onChange={(e) => setFechaFinCitacion(e.target.value)}
                      value={fechaFinCitacion}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card m-3" name="fechasCreacion">
                <div className="card-header">
                  <span className="fw-bold">Fecha de creación</span>
                </div>
                <div className="card-body">
                  <div className="rangoFechaCreacion">
                    <label htmlFor="fechaInicio" className="form-label">
                      Inicio
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fechaInicio"
                      id=""
                      onChange={(e) => setFechaInicio(e.target.value)}
                      value={fechaInicio}
                    />

                    <label htmlFor="fechaFin" className="form-label">
                      Término
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fechaFin"
                      id=""
                      onChange={(e) => setFechaFin(e.target.value)}
                      value={fechaFin}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card m-3">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <div name="estadoExped">
                    <label htmlFor="estadoExp" className="form-label fw-bold">
                      Estado expedientes
                    </label>
                    <div className="form-check">
                      <label htmlFor="pendiente" className="form-label">
                        Pendiente
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="pendiente"
                        value="Pendiente"
                        id="pendiente"
                        data-type="estado"
                        onChange={handleCheckboxChange}
                        checked={estadoFilter.pendiente || false}
                      />
                    </div>
                    <div className="form-check">
                      <label htmlFor="despachado" className="form-label">
                        Despachado
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="despachado"
                        id="despachado"
                        value="despachado"
                        data-type="estado"
                        onChange={handleCheckboxChange}
                        checked={estadoFilter.despachado || false}
                      />
                    </div>

                    <div className="form-check">
                      <label htmlFor="resuelto" className="form-label">
                        Resuelto
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="resuelto"
                        id="resuelto"
                        value="resuelto"
                        data-type="estado"
                        onChange={handleCheckboxChange}
                        checked={estadoFilter.resuelto || false}
                      />
                    </div>
                    <div className="form-check">
                      <label htmlFor="nulo" className="form-label">
                        Nulo
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="nulo"
                        id="nulo"
                        value="nulo"
                        data-type="estado"
                        onChange={handleCheckboxChange}
                        checked={estadoFilter.nulo || false}
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div name="tipoProced">
                    <label htmlFor="tipoProced" className="form-label fw-bold">
                      Tipos de procedimientos
                    </label>

                    <div className="form-check">
                      <label htmlFor="notificacion" className="form-label">
                        Notificación
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="notificacion"
                        value="notificacion"
                        id="notificacion"
                        data-type="tipo"
                        onChange={handleCheckboxChange}
                        checked={tipoProced.notificacion || false}
                      />
                    </div>
                    <div className="form-check">
                      <label htmlFor="causas" className="form-label">
                        Causas JPL
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="causas"
                        id="causas"
                        value="causas"
                        data-type="tipo"
                        onChange={handleCheckboxChange}
                        checked={tipoProced.causas || false}
                      />
                    </div>
                    <div className="form-check">
                      <label htmlFor="citacion" className="form-label">
                        Citación
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="citacion"
                        id="citacion"
                        value="citacion"
                        data-type="tipo"
                        onChange={handleCheckboxChange}
                        checked={tipoProced.citacion || false}
                      />
                    </div>

                    <div className="form-check">
                      <label htmlFor="solicitudes" className="form-label">
                        Solicitudes generales
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="solicitudes"
                        id="solicitudes"
                        value="solicitudes"
                        data-type="tipo"
                        onChange={handleCheckboxChange}
                        checked={tipoProced.solicitudes || false}
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div name="jpls">
                    <label htmlFor="jpls" className="form-label fw-bold">
                      Juzgados
                    </label>
                    <div className="form-check">
                      <label htmlFor="jpl1" className="form-label">
                        JPL 1
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="jpl1"
                        id="jpl1"
                        value="jpl1"
                        data-type="jpl"
                        onChange={handleCheckboxChange}
                        checked={jplFilter.jpl1 || false}
                      />
                    </div>
                    <div className="form-check">
                      <label htmlFor="jpl2" className="form-label">
                        JPL 2
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="jpl2"
                        id="jpl2"
                        value="jpl2"
                        data-type="jpl"
                        onChange={handleCheckboxChange}
                        checked={jplFilter.jpl2 || false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card m-3">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <div name="rut_contrib">
                    <label htmlFor="rut_contri" className="form-label fw-bold">
                      Rut Contribuyente
                    </label>
                    <input
                      type="text"
                      name="rut_contri"
                      id="rut_contri"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col">
                  <div name="inspectores">
                    <label htmlFor="inspectores" className="form-label fw-bold">
                      Inspectores
                    </label>
                    <SelectInspect
                      id="inspectores"
                      selectedInspect={selectedInspect}
                      setSelectInspect={setSelectedInspect}
                    />
                  </div>
                </div>
                <div className="col">
                  <div name="leyes">
                    <label htmlFor="leyes_1" className="form-label fw-bold">
                      Leyes
                    </label>
                    <SelectLey
                      id="leyes_1"
                      selectedLey={selectedLey}
                      setSelectedLey={setSelectedLey}
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <div name="marca">
                    <label htmlFor="marcaVeh" className="form-label fw-bold">
                      Marca Vehículo
                    </label>
                    <SelectVehContri
                      id="marcaVeh"
                      selectedVeh={selectedVeh}
                      setSelectVeh={setSelectedVeh}
                      tipo={"marca"}
                    />
                  </div>
                </div>
                <div className="col">
                  <div name="tipo">
                    <label htmlFor="tipoVeh" className="form-label fw-bold">
                      Tipo de Vehículo
                    </label>
                    <SelectVehContri
                      id="tipoVeh"
                      selectedVeh={selectedTipoVeh}
                      setSelectVeh={setSelectedTipoVeh}
                      tipo={"tipo"}
                    />
                  </div>
                </div>
                <div className="col">
                  <div name="sector">
                    <label
                      htmlFor="sectorContri"
                      className="form-label fw-bold"
                    >
                      Sector
                    </label>
                    <SelectSector
                      id="sectorContri"
                      selectedSector={selectedSector}
                      setSelectedSector={setSelectedSector}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header text-bg-success">
              <span className="fw-bold">Acciones</span>
            </div>
            <div className="card-body">
              <div
                name="botones"
                className="d-flex flex-column gap-2 align-items-center"
              >
                <button
                  onClick={() => {
                    fetchData(1);
                  }}
                  className="btn btn-danger w-50"
                >
                  <i className="bi bi-file-pdf"></i> Descargar PDF
                </button>
                <button
                  onClick={() => {
                    fetchData(2);
                  }}
                  className="btn btn-success w-50 excel"
                >
                  <i className="bi bi-file-earmark-text"></i> Descargar Excel
                </button>
                <button
                  className="btn btn-primary w-50"
                  onClick={handleClearFilter}
                >
                  <i className="bi bi-stars"></i> Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-header text-bg-success">
              <span className="fw-bold">Resumen Estadísticas</span>
            </div>
            <div className="card-body">
              <div name="btnResumen" className="row">
                <div className="col-md-6 d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenEstadoInsp}
                  >
                    <i className="bi bi-download"></i> Resumen estado
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenTipoExp}
                  >
                    <i className="bi bi-download"></i> Resumen tipo
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenLeyInspec}
                  >
                    <i className="bi bi-download"></i> Resumen por Ley
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenInspector}
                  >
                    <i className="bi bi-download"></i> Resumen por Inspector
                  </button>
                </div>
                <div className="col-md-6 d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenVehi}
                  >
                    <i className="bi bi-download"></i> Resumen por Vehiculo
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenSector}
                  >
                    <i className="bi bi-download"></i> Resumen por Sector
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenGlosa}
                  >
                    <i className="bi bi-download"></i> Resumen por Glosa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatisticsInspect;
