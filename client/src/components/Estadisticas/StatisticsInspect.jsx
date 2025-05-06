import dayjs from "dayjs";
import React, { useState } from "react";
import NavbarSGF from "../NavbarSGF";
import SelectLey from "../SelectLey";
import SelectInspect from "../SelectInspect";
import SelectVehContri from "../SelectVehContri";
import SelectSector from "../SelectSector";

function StatisticsInspect() {
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
    </>
  );
}

export default StatisticsInspect;
