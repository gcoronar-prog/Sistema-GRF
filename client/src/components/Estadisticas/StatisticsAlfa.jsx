import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import ListAlfaPDF from "../PDFs/ListAlfaPDF";
import { exportExcel } from "../exportExcel";

function StatisticsAlfa() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const printRef = useRef(null);
  const [lista, setLista] = useState([]);
  const [fechaInicioDoc, setFechaInicioDoc] = useState("");
  const [fechaFinDoc, setFechaFinDoc] = useState("");
  const [montoInicio, setMontoInicio] = useState("");
  const [montoFin, setMontoFin] = useState("");
  const [escala, setEscala] = useState("");
  const [tipoEventos, setTipoEventos] = useState("");
  const [evaDanios, setEvaDanios] = useState([]);
  const [nivEmergencia, setNivEmergencia] = useState("");
  const [danioPersonas, setDanioPersonas] = useState([]);
  const [evalNecesidad, setEvalNecesidad] = useState([]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFechaInicioDoc((prev) => (name === "fechaInicioDoc" ? value : prev));
    setFechaFinDoc((prev) => (name === "fechaFinDoc" ? value : prev));
    setMontoInicio((prev) => (name === "montoInicio" ? value : prev));
    setMontoFin((prev) => (name === "montoFin" ? value : prev));
    setEscala((prev) => (name === "escala" ? value : prev));
    setTipoEventos((prev) =>
      name === "tipoEventos"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setEvaDanios((prev) =>
      name === "evaDanios"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setNivEmergencia((prev) =>
      name === "nivEmergencia"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setDanioPersonas((prev) =>
      name === "danioPersonas"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setEvalNecesidad((prev) =>
      name === "evalNecesidad"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
  };

  useEffect(() => {
    fetchData();
  }, [
    fechaInicioDoc,
    fechaFinDoc,
    montoInicio,
    montoFin,
    escala,
    tipoEventos,
    evaDanios,
    nivEmergencia,
    danioPersonas,
    evalNecesidad,
  ]);

  const fetchData = async () => {
    let url = `${server_back}/estadisticaAlfa?`;
    let params = new URLSearchParams();

    if (fechaInicioDoc && fechaFinDoc) {
      params.append("fechaInicioDoc", fechaInicioDoc);
      params.append("fechaFinDoc", fechaFinDoc);
    }

    if (montoInicio && montoFin) {
      params.append("montoInicio", montoInicio);
      params.append("montoFin", montoFin);
    }

    if (escala) {
      params.append("escala", escala);
    }

    if (tipoEventos) {
      tipoEventos.forEach((evento) => params.append("tipoEventos", evento));
    }

    if (evaDanios) {
      evaDanios.forEach((danio) => params.append("evaDanios", danio));
    }

    if (nivEmergencia) {
      params.append("nivEmergencia", nivEmergencia);
    }

    if (danioPersonas) {
      params.append("danioPersonas", danioPersonas);
    }

    if (evalNecesidad) {
      params.append("evalNecesidad", evalNecesidad);
    }

    try {
      const response = await fetch(url + params.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      setLista(data.data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClearFilter = () => {
    setFechaInicioDoc("");
    setFechaFinDoc("");
    setMontoInicio("");
    setMontoFin("");
    setEscala("");
    setTipoEventos([]);
    setEvaDanios([]);
    setNivEmergencia([]);
    setDanioPersonas([]);
    setEvalNecesidad([]);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Informes ALFA",
  });

  const handleExportExcel = async () => {
    try {
      const response = await fetch(
        `${server_back}/estadisticaAlfa?${new URLSearchParams({
          fechaInicioDoc,
          fechaFinDoc,
          montoInicio,
          montoFin,
          escala,
          tipoEventos,
          evaDanios,
          nivEmergencia,
          danioPersonas,
          evalNecesidad,
        })}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await response.json();
      exportExcel(data.data, "resumenalfa.xlsx", "ALFA");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <>
      <hr />
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Estadísticas Informes ALFA</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card border-secondary h-100">
                <div className="card-header">
                  <strong>Fecha de informe</strong>
                </div>
                <div className="card-body">
                  <label className="form-label" htmlFor="fechaInicioDoc">
                    Fecha de inicio
                  </label>
                  <input
                    className="form-control mb-2"
                    type="datetime-local"
                    name="fechaInicioDoc"
                    id="fechaInicioDoc"
                    value={fechaInicioDoc}
                    onChange={handleChanges}
                  />
                  <label className="form-label" htmlFor="fechaFinDoc">
                    Fecha fin
                  </label>
                  <input
                    className="form-control mb-2"
                    type="datetime-local"
                    name="fechaFinDoc"
                    id="fechaFinDoc"
                    value={fechaFinDoc}
                    onChange={handleChanges}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-secondary h-100">
                <div className="card-header">
                  <strong>Monto estimado en daños</strong>
                </div>
                <div className="card-body">
                  <label className="form-label" htmlFor="montoInicio">
                    Desde:
                  </label>
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="montoInicio"
                    id="montoInicio"
                    value={montoInicio}
                    onChange={handleChanges}
                  />
                  <label className="form-label" htmlFor="montoFin">
                    Hasta:
                  </label>
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="montoFin"
                    id="montoFin"
                    value={montoFin}
                    onChange={handleChanges}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-secondary h-100">
                <div className="card-header">
                  <strong>Escala de Sismo (Mercali)</strong>
                </div>
                <div className="card-body">
                  <label className="form-label" htmlFor="escala">
                    Indique escala:
                  </label>
                  <select
                    className="form-control mb-2"
                    name="escala"
                    id="escala"
                    value={escala}
                    onChange={handleChanges}
                  >
                    <option value="">Seleccione escala de sismo</option>
                    {[
                      "I",
                      "II",
                      "III",
                      "IV",
                      "V",
                      "VI",
                      "VII",
                      "VIII",
                      "IX",
                      "X",
                      "XI",
                      "XII",
                    ].map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="card border-secondary h-100">
                  <div className="card-header">
                    <strong>Incidente/emergencia</strong>
                  </div>
                  <div className="card-body">
                    {[
                      "Inundación",
                      "Temporal",
                      "Deslizamiento",
                      "Act. Volcánica",
                      "Inc. forestal",
                      "Inc. urbano",
                      "Sust. peligrosas",
                      "Acc. Mult. Víctimas",
                      "Corte Energía",
                      "Corte agua",
                      "Otro",
                    ].map((e, idx) => (
                      <div className="form-check" key={idx}>
                        <input
                          className="form-check-input"
                          key={idx}
                          type="checkbox"
                          name="tipoEventos"
                          id={idx}
                          checked={tipoEventos.includes(e)}
                          onChange={handleChanges}
                          value={e}
                        />
                        <label className="form-check-label" htmlFor={idx}>
                          {e}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-secondary h-100">
                  <div className="card-header">
                    <strong>Daños a vivienda</strong>
                  </div>
                  <div className="card-body">
                    {[
                      "Daño menor habitable",
                      "Daño mayor no habitable",
                      "Destuidas, irrecuperables",
                      "No evaluadas",
                    ].map((e) => (
                      <div key={e} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          key={e}
                          name="evaDanios"
                          id={e}
                          onChange={handleChanges}
                          checked={evaDanios.includes(e)}
                          value={e}
                        />
                        <label className="form-check-label" htmlFor={e}>
                          {e}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-secondary h-100">
                  <div className="card-header">
                    <strong>Niveles de emergencia</strong>
                  </div>
                  <div className="card-body">
                    {[
                      "Emergencia Menor",
                      "Emergencia Mayor",
                      "Desastre",
                      "Catástrofe",
                    ].map((e, index) => (
                      <>
                        <div className="form-check" key={e}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            key={e}
                            name="nivEmergencia"
                            id={e}
                            onChange={handleChanges}
                            checked={nivEmergencia.includes(e)}
                            value={index + 1}
                          />
                          <label className="form-check-label" htmlFor={e}>
                            {e}
                          </label>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card border-secondary h-100">
                    <div className="card-header">
                      <strong>Daños a personas</strong>
                    </div>
                    <div className="card-body">
                      {[
                        "Afectadas",
                        "Damnificadas",
                        "Heridas",
                        "Muertas",
                        "Desaparecidas",
                        "Albergados",
                      ].map((e) => (
                        <>
                          <div className="form-check" key={e}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              key={e}
                              name="danioPersonas"
                              id={e}
                              onChange={handleChanges}
                              checked={danioPersonas.includes(e)}
                              value={e}
                            />
                            <label className="form-check-label" htmlFor={e}>
                              {e}
                            </label>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-secondary h-100">
                    <div className="card-header">
                      <strong>Evaluación de necesidades</strong>
                    </div>
                    <div className="card-body">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="evalNecesidad"
                          id="evalNecesidad"
                          onChange={handleChanges}
                          checked={evalNecesidad.includes("Se requiere")}
                          value={"Se requiere"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="evalNecesidad"
                        >
                          Se requiere
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="evalNecesidad"
                          id="evalNoNecesidad"
                          onChange={handleChanges}
                          checked={evalNecesidad.includes("No se requiere")}
                          value={"No se requiere"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="evalNoNecesidad"
                        >
                          No se requiere
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
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
              <button className="btn btn-danger w-75" onClick={handlePrint}>
                <i className="bi bi-file-pdf me-1"></i> Descargar PDF
              </button>
              <button
                className="btn btn-success w-75"
                onClick={handleExportExcel}
              >
                <i className="bi bi-file-earmark-excel me-1"></i> Descargar
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
      <div style={{ display: "none" }}>
        <ListAlfaPDF ref={printRef} data={lista} />
      </div>
    </>
  );
}

export default StatisticsAlfa;
