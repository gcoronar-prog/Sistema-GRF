import dayjs from "dayjs";
import React, { useState } from "react";
import NavbarSGF from "../NavbarSGF";
import SelectLey from "../SelectLey";
import SelectInspect from "../SelectInspect";
import SelectVehContri from "../SelectVehContri";
import SelectSector from "../SelectSector";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import estadoInspeccionPDF from "../PDFs/estadoInspeccionPDF";
import TipoProceInspPDF from "../PDFs/TipoProceInspPDF";

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

      estadoInspeccionPDF(data.expedientes);
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
      console.log(data);
      //TipoProceInspPDF(data.expedientes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavbarSGF />
      <hr />
      <div className="card">
        <div className="card-header">Estadisticas Inspección Municipal</div>
        <div className="card-body">
          <div name="rangoFecha" className="">
            <div className="row">
              <div className="col">
                <label htmlFor="fechaInicioInfrac" className="form-label">
                  Fecha de inicio
                </label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="fechaInicioInfrac"
                  id=""
                  onChange={(e) => setFechaInicioInfrac(e.target.value)}
                  value={fechaInicioInfrac}
                />
              </div>
              <div className="col">
                <label htmlFor="fechaFinInfrac" className="form-label">
                  Fecha de termino
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
          <div className="rangoFechaCitacion">
            <div className="row">
              <div className="col">
                <label htmlFor="fechaInicioCitacion" className="form-label">
                  Fecha de inicio
                </label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="fechaInicioCitacion"
                  id=""
                  onChange={(e) => setFechaInicioCitacion(e.target.value)}
                  value={fechaInicioCitacion}
                />
              </div>
              <div className="col">
                <label htmlFor="fechaFinCitacion" className="form-label">
                  Fecha de termino
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

          <div className="rangoFechaCreacion">
            <div className="row">
              <div className="col">
                <label htmlFor="fechaInicio" className="form-label">
                  Fecha de inicio
                </label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="fechaInicio"
                  id=""
                  onChange={(e) => setFechaInicio(e.target.value)}
                  value={fechaInicio}
                />
              </div>
              <div className="col">
                <label htmlFor="fechaFin" className="form-label">
                  Fecha de termino
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
          <div className="row">
            <div className="col">
              <div name="estadoExped">
                <label htmlFor="estadoExp">Estados</label>
                <div className="form-check">
                  <label htmlFor="pendiente" className="form-label">
                    Pendiente
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="pendiente"
                    value="pendiente"
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
                <label htmlFor="tipoProced">Tipos de procedimientos</label>

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
              <div className="jpls">
                <label htmlFor="jpls">Juzgados</label>
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

          <div className="row">
            <div className="col">
              <label htmlFor="rut_contri" className="form-label">
                Rut Contribuyente
              </label>
              <input
                type="text"
                name="rut_contri"
                id=""
                className="form-control"
              />
            </div>
            <div className="col">
              <div name="inspectores">
                <label htmlFor="">Inspectores</label>
                <SelectInspect
                  selectedInspect={selectedInspect}
                  setSelectInspect={setSelectedInspect}
                />
              </div>
            </div>
            <div className="col">
              <div name="leyes">
                <label htmlFor="">Leyes</label>
                <SelectLey
                  selectedLey={selectedLey}
                  setSelectedLey={setSelectedLey}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="">Marca Vehículo</label>
              <SelectVehContri
                selectedVeh={selectedVeh}
                setSelectVeh={setSelectedVeh}
                tipo={"marca"}
              />
            </div>
            <div className="col">
              <label htmlFor="">Tipo de Vehículo</label>
              <SelectVehContri
                selectedVeh={selectedTipoVeh}
                setSelectVeh={setSelectedTipoVeh}
                tipo={"tipo"}
              />
            </div>
            <div className="col">
              <label htmlFor="">Sector</label>
              <SelectSector
                selectedSector={selectedSector}
                setSelectedSector={setSelectedSector}
              />
            </div>
          </div>
          <br />
          <div>
            <button onClick={fetchData} className="btn btn-success">
              Descargar PDF
            </button>
            <button className="btn btn-primary" onClick={resumenEstadoInsp}>
              Resumen estado
            </button>
            <button className="btn btn-primary" onClick={resumenTipoExp}>
              Resumen tipo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatisticsInspect;
