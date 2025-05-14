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
import RangoCentralPDF from "../PDFs/RangoCentralPDF.jsx";
import EstadoCentralPDF from "../PDFs/EstadoCentralPDF.jsx";
import NavbarSGF from "../NavbarSGF.jsx";

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

  const [rangoFilter, setRangoFilter] = useState([]);
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
      //setCentral(data.informe || []);
      //console.log(data.informe);
      generarPDF(data.informe);
      /* if (className === "excel") {
        exportExcel(data.informe, "Central.xlsx");
      }*/
    } catch (error) {
      console.log(error);
    }
  };

  const generarPDF = (dato) => {
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
    console.log(dato);
    const tableRows = dato.map((c) => [
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

      console.log("filtro", data);
      RecursosCentralPDF(fechaInicio, fechaFin, data.informe);
    } catch (error) {
      console.log(error);
    }
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

      console.log("filtroClasif", data.informe);
      ClasifCentralPDF(fechaInicio, fechaFin, data.informe);
    } catch (error) {
      console.log(error);
    }
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

      console.log("filtro origen", data.informe);
      OrigenCentralPDF(fechaInicio, fechaFin, data.informe);
    } catch (error) {
      console.log(error);
    }
  };

  const resumenEstadoPDF = async () => {
    const url = "http://localhost:3000/resumen_estado_central?";
    const params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();

      EstadoCentralPDF(fechaInicio, fechaFin, data.informe);
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }
  };

  const resumenRangoPDF = async () => {
    const url = "http://localhost:3000/resumen_rango_central?";
    const params = new URLSearchParams();
    try {
      const res = await fetch(url + params.toString());
      const data = await res.json();

      RangoCentralPDF(fechaInicio, fechaFin, data.informe);
      console.log("filtro origen", data.informe);
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
    <>
      <NavbarSGF formulario={"central"} />
      <hr />
      <div className="card">
        <div className="card-header text-bg-success">
          <span className="fw-bold">Estadisticas Inspección Municipal </span>
        </div>
        <div className="card-body">
          <div className="rangoFecha">
            <div className="row p-2">
              <div className="col-md-3">
                <label htmlFor="fechaInicio" className="form-label fw-bold">
                  Fecha de inicio
                </label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="fechaInicio"
                  id="fechaInicio"
                  onChange={(e) => setFechaInicio(e.target.value)}
                  value={fechaInicio}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="fechaFin" className="form-label fw-bold">
                  Fecha de termino
                </label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="fechaFin"
                  id="fechaFin"
                  onChange={(e) => setFechaFin(e.target.value)}
                  value={fechaFin}
                />
              </div>
              <div className="col-md-3">
                <div className="estadoInforme">
                  <label htmlFor="estado" className="form-label fw-bold">
                    Estado informes
                  </label>
                  <div className="form-check">
                    <label htmlFor="atendido">Atendido</label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="atendido"
                      value="atendido"
                      id="atendido"
                      data-type="estado"
                      onChange={handleCheckboxChange}
                      checked={estadoFilter.atendido || false}
                    />
                  </div>
                  <div className="form-check">
                    <label htmlFor="progreso">En progreso</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="progreso"
                      id="progreso"
                      value="progreso"
                      data-type="estado"
                      onChange={handleCheckboxChange}
                      checked={estadoFilter.progreso || false}
                    />
                  </div>
                  <div className="form-check">
                    <label htmlFor="pendiente">Pendiente</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="pendiente"
                      id="pendiente"
                      value="pendiente"
                      data-type="estado"
                      onChange={handleCheckboxChange}
                      checked={estadoFilter.pendiente || false}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <label htmlFor="" className="form-label fw-bold">
                  Captura de información
                </label>
                <div className="capturaInforme">
                  <div className="form-check">
                    <label htmlFor="radios">Radio</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="radios"
                      id="radios"
                      value="radios"
                      data-type="captura"
                      onChange={handleCheckboxChange}
                      checked={capturaFilter.radios || false}
                    />
                  </div>
                  <div className="form-check">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="telefono"
                      id="telefono"
                      value="telefono"
                      data-type="captura"
                      onChange={handleCheckboxChange}
                      checked={capturaFilter.telefono || false}
                    />
                  </div>
                  <div className="form-check">
                    <label htmlFor="rrss">RRSS</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="rrss"
                      id="rrss"
                      value="rrss"
                      data-type="captura"
                      onChange={handleCheckboxChange}
                      checked={capturaFilter.rrss || false}
                    />
                  </div>
                  <div className="form-check">
                    <label htmlFor="presencial">Presencial</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="presencial"
                      id="presencial"
                      value="presencial"
                      data-type="captura"
                      onChange={handleCheckboxChange}
                      checked={capturaFilter.presencial || false}
                    />
                  </div>
                  <div className="form-check">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="email"
                      id="email"
                      value="email"
                      data-type="captura"
                      onChange={handleCheckboxChange}
                      checked={capturaFilter.email || false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row p-2">
            <div className="col">
              <div className="clasiInforme">
                <label htmlFor="clasificacion" className="form-label fw-bold">
                  Clasificación
                </label>

                <SelectClasifica
                  id="clasificacion"
                  selectedClasif={selectedClasif}
                  setSelectedClasif={setSelectedClasif}
                />
              </div>
            </div>
            <div className="col">
              <div className="origenInforme">
                <label htmlFor="" className="form-label fw-bold">
                  Origen:
                </label>
                <SelectOrigin
                  selectedOrigin={selectedOrigen}
                  setSelectedOrigin={setSelectedOrigen}
                />
              </div>
            </div>
            <div className="col">
              <div className="sectorInforme">
                <label htmlFor="" className="form-label fw-bold">
                  Sector:
                </label>
                <SelectSector
                  selectedSector={selectedSector}
                  setSelectedSector={setSelectedSector}
                />
              </div>
            </div>
          </div>
          <div className="row p-2">
            <div className="col">
              <div className="tipoReporte">
                <label htmlFor="" className="form-label fw-bold">
                  Tipo de informe:
                </label>
                <SelectTipo
                  tipo={selectedClasif}
                  selectedTipo={selectedTipo}
                  setSelectedTipo={setSelectedTipo}
                />
              </div>
            </div>
            <div className="col">
              <div className="recursosInvolucrados">
                <label htmlFor="" className="form-label fw-bold">
                  Recursos
                </label>
                <SelectRecursos
                  selectedRecursos={selectedRecursos}
                  setSelectedRecursos={setSelectedRecursos}
                />
              </div>
            </div>
            <div className="col">
              <div className="vechiculoInforme">
                <label htmlFor="" className="form-label fw-bold">
                  Vehículos:
                </label>
                <SelectVehiculo
                  selectedVehiculo={selectedVehiculo}
                  setSelectedVehiculo={setSelectedVehiculo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/*BOTONEEEEES! */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header text-bg-success">
              <span className="fw-bold">Acciones</span>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2 align-items-center">
                <button className="btn btn-danger w-50" onClick={fetchData}>
                  <i className="bi bi-file-pdf"></i> Descargar PDF
                </button>
                <button
                  className="btn btn-success w-50"
                  onClick={() => exportExcel(central, "Central.xlsx")}
                >
                  <i className="bi bi-file-earmark-text"></i> Exportar a Excel
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
              <span className="fw-bold">Resumen estadisticas</span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenRecursosPDF}
                  >
                    <i className="bi bi-download"></i> Recursos involucrados
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenClasifPDF}
                  >
                    <i className="bi bi-download"></i> Clasificación
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenOrigenPDF}
                  >
                    <i className="bi bi-download"></i> Origen
                  </button>
                </div>
                <div className="col-md-6 d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenRangoPDF}
                  >
                    <i className="bi bi-download"></i> Rango Horario
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={resumenEstadoPDF}
                  >
                    <i className="bi bi-download"></i> Estado Informe
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

export default StatisticsCentral;
