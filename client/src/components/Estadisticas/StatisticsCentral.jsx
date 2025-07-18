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
    const logo =
      "data:image/png;base64,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";

    const logoSegPub =
      "data:image/png;base64,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";
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
        4: { cellWidth: 21 },
        5: { cellWidth: 20 },
        6: { cellWidth: 21 },
        7: { cellWidth: 40 },
        9: { cellWidth: 39 },
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
                  handler: resumenRecursosPDF,
                },
                {
                  text: "Clasificación",
                  handler: resumenClasifPDF,
                },
                {
                  text: "Origen",
                  handler: resumenOrigenPDF,
                },
                {
                  text: "Rango Horario",
                  handler: resumenRangoPDF,
                },
                {
                  text: "Estado Informe",
                  handler: resumenEstadoPDF,
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
