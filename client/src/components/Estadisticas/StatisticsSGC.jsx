import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState } from "react";
import SelectSector from "../SelectSector";
import SelectPoblacion from "../SelectPoblacion";
import SelectJJVV from "../SelectJJVV";
import { exportExcel } from "../exportExcel";

function StatisticsSGC() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [rut_soli, setRut_soli] = useState("");
  const [selectedSector, setSelectedSector] = useState([]);
  const [selectedPobla, setSelectedPobla] = useState([]);
  const [selectedJJVV, setSelectedJJVV] = useState([]);
  const [estadoFilter, setEstadoFilter] = useState({
    Proceso: false,
    Seguimiento: false,
    Visitado: false,
    Atendido: false,
    Derivado: false,
    Desistido: false,
    Anulado: false,
  });
  const [tipo_soli, setTipo_soli] = useState({
    Asesoría: false,
    Denuncia: false,
    "Mesa Trabajo": false,
    Petición: false,
    Prevención: false,
    Propuesta: false,
    Queja: false,
    Reclamo: false,
    Sugerencia: false,
    Trámite: false,
  });

  const token = localStorage.getItem("token");

  const fetchDatos = async (tipoDoc) => {
    let url = `${server_back}/estadisticaSGC?`;
    let params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fecha_solicitud_inicio", fechaInicio);
      params.append("fecha_solicitud_fin", fechaFin);
    }

    if (rut_soli) {
      params.append("rut_solicitante", JSON.stringify(rut_soli));
    }

    Object.keys(estadoFilter).forEach((estado) => {
      if (estadoFilter[estado]) {
        params.append("estado_solicitud", estado);
      }
    });

    Object.keys(tipo_soli).forEach((tipo) => {
      if (tipo_soli[tipo]) {
        params.append("tipo_solicitud", tipo);
      }
    });

    if (selectedSector && selectedSector.value) {
      params.append("sector_solicitud", JSON.stringify(selectedSector));
    }

    if (selectedPobla && selectedPobla.value) {
      params.append("poblacion", JSON.stringify(selectedPobla));
    }
    if (selectedJJVV && selectedJJVV.value) {
      params.append("jjvv", JSON.stringify(selectedJJVV));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("selectedsector ", selectedSector);
      console.log("params ", params.toString());
      if (data.atencion.length !== 0) {
        if (tipoDoc === 1) {
          generarPDFSGC(data.atencion);
        } else if (tipoDoc === 2) {
          exportExcel(data.atencion, "Atenciones.xlsx", "SGC");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generarPDFSGC = (dato) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
    const logoSegPub = `${import.meta.env.VITE_LOGO_SEG}`;
    doc.addImage(logo, "PNG", 250, 5, 35, 18);
    doc.addImage(logoSegPub, "PNG", 200, 9, 42, 15);

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Atenciones de público Seguridad Ciudadana", 14, 15);

    let filtros = `Filtros aplicados:\n`;
    if (fechaInicio && fechaFin) {
      filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
        "es-ES"
      )} - ${new Date(fechaFin).toLocaleString("es-ES")}`;
    }
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(filtros, 14, 25);

    const tableColumn = [
      "ID atención",
      "Fecha solicitud",
      "Tipo solicitud",
      "Estado de solicitud",
      "Nombre",
      "RUT",
      "Teléfono",
      "Sector",
      "Población",
      "JJVV",
    ];

    const tableRows = dato.map((d) => [
      d.cod_atencion,
      new Date(d.fecha_solicitud).toLocaleDateString("es-ES"),
      d.tipo_solicitud,
      d.estado_solicitud,
      d.nombre_solicitante,
      d.rut_solicitante,
      d.telefono_solicitante,
      d.sector_solicitante?.label || "-",
      d.poblacion_solicitante?.label || "-",
      d.junta_vecinos?.label || "-",
    ]);

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
    });
    doc.output("dataurlnewwindow");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, dataset, value } = e.target;
    if (dataset.type === "tipo") {
      setTipo_soli((prev) => ({ ...prev, [name]: checked }));
    } else if (dataset.type === "estado") {
      setEstadoFilter((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleClearFilter = () => {
    setFechaInicio("");
    setFechaFin("");
    setRut_soli("");
    setSelectedSector([]);
    setSelectedPobla([]);
    setSelectedJJVV([]);
    setEstadoFilter({
      Proceso: false,
      Seguimiento: false,
      Visitado: false,
      Atendido: false,
      Derivado: false,
      Desistido: false,
      Anulado: false,
    });
    setTipo_soli({
      Asesoria: false,
      Denuncia: false,
      "Mesa Trabajo": false,
      Petición: false,
      Prevención: false,
      Propuesta: false,
      Queja: false,
      Reclamo: false,
      Sugerencia: false,
      Trámite: false,
    });
  };

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Estadísticas Atención de público</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Fecha atenciones</strong>
                </div>
                <div className="card-body">
                  <label className="form-label fw-bold">Fecha de inicio</label>
                  <input
                    className="form-control mb-2"
                    type="datetime-local"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                  <label className="form-label fw-bold">Fecha fin</label>
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
                  <strong>Estado de atenciones</strong>
                </div>
                <div className="card-body">
                  <div className="row">
                    {Object.keys(estadoFilter).map((key) => (
                      <div className="col" key={key}>
                        <div className="form-check form-check-inline" key={key}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={key}
                            data-type="estado"
                            name={key}
                            value={key}
                            checked={estadoFilter[key] || false}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Tipo de solicitudes</strong>
                </div>
                <div className="card-body">
                  <div className="row">
                    {Object.keys(tipo_soli).map((key) => (
                      <div className="col" key={key}>
                        <div className="form-check form-check-inline" key={key}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={key}
                            data-type="tipo"
                            name={key}
                            value={key}
                            checked={tipo_soli[key] || false}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mt-3">
              <div className="col-md-4">
                <label htmlFor="" className="form-label fw-bold">
                  Rut usuario
                </label>
                <input className="form-control" type="text" />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="form-label fw-bold">
                  Sector de residencia
                </label>
                <SelectSector
                  selectedSector={selectedSector}
                  setSelectedSector={setSelectedSector}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="form-label fw-bold">
                  Población
                </label>
                <SelectPoblacion
                  selectedPobla={selectedPobla}
                  setSelectedPobla={setSelectedPobla}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="form-label fw-bold">
                  J.J.V.V.
                </label>
                <SelectJJVV
                  selectedJJVV={selectedJJVV}
                  setSelectedJJVV={setSelectedJJVV}
                />
              </div>
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
                onClick={() => fetchDatos(1)}
              >
                <i className="bi bi-file-pdf me-1"></i> Descargar PDF
              </button>
              <button
                className="btn btn-success w-75"
                onClick={() => fetchDatos(2)}
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
      </div>
    </>
  );
}

export default StatisticsSGC;
