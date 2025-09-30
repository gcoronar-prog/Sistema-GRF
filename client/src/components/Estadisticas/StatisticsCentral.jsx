import { useEffect, useState } from "react";
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
import SelectUsers from "./SelectUsers.jsx";
import UserCentralPDF from "../PDFs/UserCentralPDF.jsx";
import VehiculoCentralPDF from "../PDFs/VehiculoCentralPDF.jsx";

function StatisticsCentral() {
  const startMonth = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const dateNow = dayjs().format("YYYY-MM-DDTHH:mm");

  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;
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
  const [selectedUser, setSelectedUser] = useState("");

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
    let url = `${server_back}/estadisticaCentral?`;
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
    const userCentral = selectedUser.value;
    if (selectedUser) {
      params.append("centralista", userCentral);
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
    const logo = `${import.meta.env.VITE_LOGO_MUNI}`;

    const logoSegPub = `${import.meta.env.VITE_LOGO_SEG}`;
    //doc.addImage(imagen,formato,x,y,ancho,alto)
    doc.addImage(logo, "PNG", 250, 5, 35, 18);
    doc.addImage(logoSegPub, "PNG", 200, 9, 42, 15);
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
      //"Descripción",
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
      //c.descripcion_informe || "-",
      c.sector_informe?.label || "-",
      c.direccion_informe || "-",
    ]);

    // Tabla con estilo profesional
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "grid",
      tableWidth: "full",
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
        4: { cellWidth: 21 },
        5: { cellWidth: 20 },
        6: { cellWidth: 21 },
        7: { cellWidth: 40 },
        9: { cellWidth: 39 },
      },
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
    setSelectedUser([]);
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

  const fetchResumen = async (endpoint, pdf) => {
    const url = `${server_back}/${endpoint}?`;
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

    if (selectedUser) {
      params.append("centralista", selectedUser.value);
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      if (data.informe.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        pdf(data, fechaInicio, fechaFin);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resumenRecursos = () =>
    fetchResumen("resumen_recursos_central", RecursosCentralPDF);
  const resumenClasi = () =>
    fetchResumen("resumen_clasif_central", ClasifCentralPDF);
  const resumenOrigen = () =>
    fetchResumen("resumen_origen_central", OrigenCentralPDF);
  const resumenEstado = () =>
    fetchResumen("resumen_estado_central", EstadoCentralPDF);
  const resumenRango = () =>
    fetchResumen("resumen_rango_central", RangoCentralPDF);
  const resumenUser = () =>
    fetchResumen("resumen_user_central", UserCentralPDF);
  const resumenVehi = () =>
    fetchResumen("resumen_vehi_central", VehiculoCentralPDF);

  return (
    <>
      <hr />
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Estadísticas Central Municipal</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Fecha de informes</strong>
                </div>
                <div className="card-body">
                  <label htmlFor="fechaInicio" className="form-label fw-bold">
                    Inicio
                  </label>
                  <input
                    className="form-control mb-2"
                    type="datetime-local"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                  <label htmlFor="fechaFin" className="form-label fw-bold">
                    Término
                  </label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Estado Informes</strong>
                </div>
                <div className="card-body">
                  {Object.keys(estadoFilter).map((key) => (
                    <div className="form-check" key={key}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={key}
                        name={key}
                        data-type="estado"
                        value={key}
                        checked={estadoFilter[key] || false}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Captura de Información</strong>
                </div>
                <div className="card-body">
                  {Object.keys(capturaFilter).map((key) => (
                    <div className="form-check" key={key}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={key}
                        name={key}
                        data-type="captura"
                        value={key}
                        checked={capturaFilter[key] || false}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Clasificación</label>
              <SelectClasifica
                selectedClasif={selectedClasif}
                setSelectedClasif={setSelectedClasif}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Origen</label>
              <SelectOrigin
                selectedOrigin={selectedOrigen}
                setSelectedOrigin={setSelectedOrigen}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Sector</label>
              <SelectSector
                selectedSector={selectedSector}
                setSelectedSector={setSelectedSector}
              />
            </div>
          </div>

          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Tipo de informe</label>
              <SelectTipo
                tipo={selectedClasif}
                selectedTipo={selectedTipo}
                setSelectedTipo={setSelectedTipo}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Recursos</label>
              <SelectRecursos
                selectedRecursos={selectedRecursos}
                setSelectedRecursos={setSelectedRecursos}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Vehículos</label>
              <SelectVehiculo
                selectedVehiculo={selectedVehiculo}
                setSelectedVehiculo={setSelectedVehiculo}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Centralista</label>
              <SelectUsers
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                estadistica={true}
                tipo={"central"}
              />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <strong>Acciones</strong>
            </div>
            <div className="card-body d-flex flex-column gap-3 align-items-center">
              <button
                className="btn btn-danger w-75"
                onClick={() => fetchData(1)}
              >
                <i className="bi bi-file-pdf me-1"></i> Descargar PDF
              </button>
              <button
                className="btn btn-success w-75"
                onClick={() => fetchData(2)}
              >
                <i className="bi bi-file-earmark-excel me-1"></i> Exportar a
                Excel
              </button>
              <button
                className="btn btn-primary w-75"
                onClick={handleClearFilter}
              >
                <i className="bi bi-stars me-1"></i> Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <strong>Resumen Estadísticas</strong>
            </div>
            <div className="card-body row g-2">
              {[
                {
                  text: "Recursos involucrados",
                  handler: resumenRecursos,
                },
                {
                  text: "Clasificación",
                  handler: resumenClasi,
                },
                {
                  text: "Origen",
                  handler: resumenOrigen,
                },
                {
                  text: "Rango Horario",
                  handler: resumenRango,
                },
                {
                  text: "Estado Informe",
                  handler: resumenEstado,
                },
                {
                  text: "Informes por centralista",
                  handler: resumenUser,
                },
                {
                  text: "Resumen vehículos",
                  handler: resumenVehi,
                },
              ].map((btn, idx) => (
                <div className="col-md-6" key={idx}>
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={btn.handler}
                  >
                    <i className="bi bi-download me-1"></i> {btn.text}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <br />
    </>
  );
}

export default StatisticsCentral;
