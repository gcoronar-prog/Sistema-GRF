import { useState } from "react";
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

function StatisticsCentral() {
  const startMonth = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const dateNow = dayjs().format("YYYY-MM-DDTHH:mm");

  const server_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

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

  /*const [rangoFilter, setRangoFilter] = useState([]);
  const [clasifFilter, setClasifFilter] = useState(defaultValues);
  const [origenFilter, setOrigenFilter] = useState(defaultValues);
  const [recursosFilter, setRecursosFilter] = useState([]);*/
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

  const fetchData = async (tipoDoc) => {
    let url = `${server_local}/estadisticaCentral?`;
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
      const res = await fetch(url + params.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      //setCentral(data.informe || []);
      //console.log(data.informe);
      if (data.informe.length !== 0) {
        if (tipoDoc === 1) {
          generarPDF(data.informe);
          console.log(data.informe.length);
        } else if (tipoDoc === 2) {
          exportExcel(data.informe, "Central.xlsx", "central");
        }
      } else {
        alert("No hay datos para mostrar");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generarPDF = (dato) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Título
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Reportes Central Municipal", 14, 15);

    // Filtros
    let filtros = `Filtros aplicados:\n`;
    if (fechaInicio && fechaFin) {
      filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
        "es-ES"
      )} - ${new Date(fechaFin).toLocaleString("es-ES")}`;
    }
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(filtros, 14, 25);

    // Columnas
    const tableColumn = [
      "ID",
      "Fecha",
      "Clasificación",
      "Origen",
      "Persona",
      "Fuente Captura",
      "Tipo de Informe",
      "Descripción",
      "Sector",
      "Dirección",
    ];

    // Filas
    const tableRows = dato.map((c) => [
      c.cod_informes_central,
      new Date(c.fecha_informe).toLocaleString("es-ES"),
      c.clasificacion_informe?.label || "-",
      c.origen_informe?.label || "-",
      c.persona_informante?.label || "-",
      c.captura_informe || "-",
      c.tipo_informe?.label || "-",
      c.descripcion_informe || "-",
      c.sector_informe?.label || "-",
      c.direccion_informe || "-",
    ]);

    // Tabla con estilo profesional
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: "middle",
        textColor: 33,
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [33, 37, 41],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 35 },
        7: { cellWidth: 50 },
        9: { cellWidth: 40 },
      },
    });

    doc.output("dataurlnewwindow");
  };

  const resumenRecursosPDF = async () => {
    const url = `${server_local}/resumen_recursos_central?`;
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
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.informe.length === 0) {
        alert("No existen registros");
      } else {
        RecursosCentralPDF(fechaInicio, fechaFin, data.informe);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenClasifPDF = async () => {
    const url = `${server_local}/resumen_clasif_central?`;
    const params = new URLSearchParams();

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
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.informe.length === 0) {
        alert("No existen registros");
      } else {
        ClasifCentralPDF(fechaInicio, fechaFin, data.informe);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenOrigenPDF = async () => {
    const url = `${server_local}/resumen_origen_central?`;
    const params = new URLSearchParams();

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
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.informe.length === 0) {
        alert("No existen registros");
      } else {
        OrigenCentralPDF(fechaInicio, fechaFin, data.informe);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenEstadoPDF = async () => {
    const url = `${server_local}/resumen_estado_central?`;
    const params = new URLSearchParams();

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
      const res = await fetch(url + params.toString(), {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.informe.length === 0) {
        alert("No existen registros");
      } else {
        EstadoCentralPDF(fechaInicio, fechaFin, data.informe);
      }
      console.log("filtro", data);
    } catch (error) {
      console.log(error);
    }
  };

  const resumenRangoPDF = async () => {
    const url = `${server_local}/resumen_rango_central?`;
    const params = new URLSearchParams();
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
      const res = await fetch(url + params.toString(), {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.informe.length === 0) {
        alert("No existen registros ");
      } else {
        RangoCentralPDF(fechaInicio, fechaFin, data.informe);
      }
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
      <hr />
      <div className="card">
        <div className="card-header text-bg-success">
          <span className="fw-bold">Estadisticas Central Municipal </span>
        </div>
        <div className="card-body">
          <div className="rangoFecha">
            <div className="row p-2">
              <div className="col-4">
                <div className="card">
                  <div className="card-header">
                    <span className="fw-bold">Fecha de infomes</span>
                  </div>
                  <div className="card-body">
                    <label
                      htmlFor="fechaInicio"
                      className="form-label fw-bold p-1"
                    >
                      Inicio
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fechaInicio"
                      id="fechaInicio"
                      onChange={(e) => setFechaInicio(e.target.value)}
                      value={fechaInicio}
                    />
                    <label
                      htmlFor="fechaFin"
                      className="form-label fw-bold p-1"
                    >
                      Término
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
                </div>
              </div>
              <div className="col-1">{/*hago puro espacio jejejeje >:D */}</div>
              <div className="col-3">
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
              <div className="col-3">
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
                <button
                  className="btn btn-danger w-50"
                  onClick={() => fetchData(1)}
                >
                  <i className="bi bi-file-pdf"></i> Descargar PDF
                </button>
                <button
                  className="btn btn-success w-50"
                  onClick={() => fetchData(2)}
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
      <br />
    </>
  );
}

export default StatisticsCentral;
