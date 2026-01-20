import { forwardRef } from "react";
import "./CSS/alfaPrint.css";

const AlfaPDF = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const afectados = Object.fromEntries(
    Object.entries(data.tipo_afectados || {}).map(([k, v]) => [
      k.toUpperCase(),
      v,
    ]),
  );

  const eventoIzq = [
    "INUNDACIÓN",
    "TEMPORAL",
    "DESLIZAMIENTO",
    "ACT. VOLCÁNICA",
    "INC. FORESTAL",
    "OTRO",
  ];

  const eventoDere = [
    "INCENDIO URBANO",
    "SUST. PELIGROSAS",
    "ACC. MULT. VÍCTIMAS",
    "CORTE ENERGÍA ELECT.",
    "CORTE AGUA POTABLE",
  ];

  const arrayEmergencia = [
    "Emergencia Menor:",
    "Emergencia Mayor:",
    "Desastre:",
    "Catástrofe:",
  ];
  const detalleEmergencia = [
    " situación con un nivel de afectación que permite ser gestionada con capacidades comunales y, eventualmente, con refuerzos o apoyos desde otras zonas, a través de una coordinacion ade nivel comunal.",
    " situación con un nivel de afectación que permite ser gestionada con capacidades regionales y, eventualmente, con refuerzos o apoyos desde otras zonas, a través de una coordinacion de nivel provincial o regional.",
    " situación con un nivel de afectación e impacto que no permite ser gestionada con capacidades regionales, requiriendo de refuerzos o apoyos desde otras zonas del país, a través de una coordinación de nivel nacional.",
    " situación con un nivel de afectación e impacto que requiere de asistencia internacional, como apoyo a las capacidades del país, a través de una coordinación a nivel nacional.",
  ];

  const horaOcurrencia =
    data.fecha_ocurrencia.slice(10).replace("T", " HORA: ") || "";
  const diaOcurrencia = "   DÍA " + data.fecha_ocurrencia.slice(8, 10) || "";
  const mesOcurrencia = "   MES " + data.fecha_ocurrencia.slice(5, 7) || "";
  const anioOcurrencia = "   AÑO " + data.fecha_ocurrencia.slice(0, 4) || "";

  const horaDocumento = "";

  return (
    <div ref={ref} className="alfa-pdf">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-2">
        <span className="fw-bold" style={{ fontSize: "15px" }}>
          INFORME DE INCIDENTE O EMERGENCIA Nº {data.cod_alfa}
        </span>
      </div>

      {/* ================= 1. IDENTIFICACIÓN ================= */}
      <section className="mb-2" style={{ border: "1px solid" }}>
        <div className="d-flex mt-2 p-2">
          <div className="flex-shrink-2 mb-1 me-1 ms-1 p-0">
            <span className="fw-bold">1. IDENTIFICACIÓN:</span>
          </div>
          <div className="flex-shrink-2 ms-3">
            <span>REGIÓN: {data.region}</span>
            <div className="flex-fill mt-1">FUENTE(S): {data.fuente_info}</div>
          </div>
          <div className="flex-shrink-2 ms-4">PROVINCIA: {data.provincia}</div>
          <div className="flex-shrink-2 ms-4">
            COMUNA: {data.comuna}
            <div className="flex-fill mt-1">FONO: {data.telefono}</div>
          </div>
        </div>
      </section>

      {/* ================= 2. TIPO DE EVENTO ================= */}
      <section className="border p-0 mb-0">
        <div className="fw-bold mb-0 ms-2">2. TIPO DE EVENTO</div>
        <div className="row mb-0" style={{ marginInlineStart: "1.5px" }}>
          <div className="col">
            <div className="col">
              <div className="ms-3">
                <span className="p-0 mt-0" style={{ fontSize: "10.5px" }}>
                  SISMO (ESCALA MERCALI)
                </span>
                <div className="escala-grid">
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
                  ].map((nivel) => (
                    <div
                      key={nivel}
                      style={{
                        borderStyle: data.escala_sismo.includes(nivel)
                          ? "solid"
                          : "none",
                        borderWidth: "0.5px",
                        padding: "0.8px",
                      }}
                    >
                      <label
                        htmlFor=""
                        style={{
                          padding: "0px",
                          marginTop: "0px",
                          lineHeight: "0px",
                        }}
                      >
                        {nivel}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row w-100">
                <div className="col">
                  <table className="w-100">
                    <thead></thead>
                    <tbody>
                      {eventoIzq.map((eveIzq, i) => {
                        const eveDer = eventoDere[i] || "";
                        return (
                          <tr key={eveIzq}>
                            <td
                              style={{
                                border: "1px solid",
                                width: "10%",
                                height: "80%",
                              }}
                            >
                              <span className="ms-2">
                                {data.tipo_evento.includes(eveIzq) ? "X" : ""}
                              </span>
                            </td>
                            <td>
                              <span className="ms-1">{eveIzq}</span>
                            </td>
                            {eveDer ? (
                              <>
                                <td
                                  style={{ border: "1px solid", width: "10%" }}
                                >
                                  <span className="ms-2">
                                    {data.tipo_evento.includes(eveDer)
                                      ? "X"
                                      : ""}
                                  </span>
                                </td>
                                <td>
                                  <span className="ms-1">{eveDer}</span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td></td>
                                <td></td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col mb-0">
            <strong>DESCRIPCIÓN DEL EVENTO:</strong>
            <div className="line-box">{data.desc_evento}</div>
          </div>
        </div>
      </section>
      <section
        style={{
          border: "1px solid",
          padding: "0px 0px",
        }}
      >
        <div className="row m-0 p-0">
          <div className="px-0 col-6">
            <span style={{ marginInlineStart: "3px" }}>OCURRENCIA:</span>
            <div className="p-0" style={{ marginTop: "3px" }}>
              <ul
                className="list-inline ms-1"
                style={{
                  marginTop: "0px",
                  fontSize: "9px",
                  marginBottom: "0px",
                }}
              >
                <li className="list-inline-item me-3">{horaOcurrencia}</li>
                <li className="list-inline-item me-3">{diaOcurrencia}</li>
                <li className="list-inline-item me-3">{mesOcurrencia}</li>
                <li className="list-inline-item me-3">{anioOcurrencia}</li>
              </ul>
            </div>
          </div>

          <div className="col" style={{ padding: "0.5px" }}>
            <span className="ms-3">DIRECCIÓN / UBICACIÓN:</span>
            <div className="ms-3" style={{ marginTop: "3px" }}>
              {data.direccion}
            </div>
          </div>

          <div className="col-1 p-0 text-center">
            <div style={{ border: "1px solid", height: "auto" }}>
              <span className="fw-bold">
                U {data.tipo_ubicacion.includes("Urbana") ? "X" : ""}
              </span>
            </div>
            <div style={{ border: "1px solid", height: "auto" }}>
              <span className="fw-bold">
                R {data.tipo_ubicacion.includes("Rural") ? "X" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. DAÑOS ================= */}
      <section
        className="mb-0"
        style={{
          border: "1px solid",
          padding: "0px 0px",
        }}
      >
        <div className="row">
          <div className="col border">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <table className="m-0 " style={{ width: "30%" }}>
                  <thead>
                    <tr>
                      <th className="p-1 pt-0">
                        <span className="fw-bold m-0 text-break">3.DAÑOS</span>
                        <span className="fw-bold mt-1 mb-0 ms-1">PERSONAS</span>
                      </th>
                      <th
                        style={{ width: "16%" }}
                        className="text-center align-bottom p-1 px-2"
                      >
                        H
                      </th>
                      <th
                        style={{ width: "16%" }}
                        className="text-center align-bottom p-1 px-2"
                      >
                        M
                      </th>
                      <th className="text-center align-bottom p-1">Total</th>
                    </tr>
                  </thead>
                  <tbody className="ps-1">
                    {[
                      "AFECTADAS",
                      "DAMNIFICADAS*",
                      "HERIDAS",
                      "MUERTAS",
                      "DESAPARECIDAS* ",
                      "ALBERGADOS* ",
                    ].map((tipo) => {
                      const h = afectados[tipo]?.hombres || "";
                      const m = afectados[tipo]?.mujeres || "";
                      return (
                        <tr key={tipo} className="mb-0">
                          <td className="px-1 ms-1" style={{ fontSize: "9px" }}>
                            {tipo}
                          </td>
                          <td
                            className="px-1 text-center"
                            style={{
                              border: "1px solid",
                              padding: "0px 0px",
                            }}
                          >
                            {h}
                          </td>
                          <td
                            className="px-1 text-center"
                            style={{
                              border: "1px solid",
                              padding: "0px 0px",
                            }}
                          >
                            {m}
                          </td>
                          <td
                            className="px-1 text-center"
                            style={{
                              border: "1px solid",
                              padding: "0px 0px",
                            }}
                          >
                            {h + m}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col me-n4 mt-3">
                <div className="fw-bold mb-0 ">VIVIENDAS</div>
                {[
                  "DAÑO MENOR HABITABLE",
                  "DAÑO MAYOR NO HABITABLE",
                  "DESTRUIDAS, IRRECUPERABLE",
                ].map((danio) => (
                  <div className="row p-0 m-0" key={danio}>
                    <div className="col m-0 p-0 ms-2">
                      <span style={{ fontSize: "10px" }}>{danio}</span>
                    </div>

                    <div className="col-auto m-0 p-0 me-2">
                      <table
                        className="m-0 me-3"
                        style={{
                          width: "46px",
                          tableLayout: "fixed",
                          border: "1px solid",
                          padding: "0px 0px",
                        }}
                      >
                        <tbody>
                          <tr className="">
                            <td style={{ height: "26px" }}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
                <br />
                <br />
                <div className="row p-0 m-0">
                  <div className="col m-0 p-0 mt-2 ms-2">
                    <span>NO EVALUADAS</span>
                  </div>
                  <div className="col-auto m-0 p-0">
                    <table
                      className="m-0 me-4"
                      style={{
                        width: "46px",
                        tableLayout: "fixed",
                        border: "1px solid",
                        padding: "0px 0px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ height: "26px" }}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <span className="mt-1">
                (*) OBLIGATORIEDAD DE DESAGREGAR POR SEXO
              </span>
            </div>
          </div>
          <div className="col p-0 ms-2 d-flex flex-column">
            <div className="mt-3">
              <span>SERVICIOS BÁSICOS, INFRAESTRUCTURAS Y OTROS:</span>
              <div className="me-1 p-1">{data.danio_vivienda}</div>
            </div>
            <div className="mt-auto">
              <span>MONTO ESTIMADO DE DAÑOS ($):</span>
              <span style={{ fontSize: "12px" }}>{data.monto_danio}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. ACCIONES ================= */}
      <section
        className="p-0"
        style={{ border: "1px solid", padding: "0px 0px" }}
      >
        <div className="row g-2 mt-0">
          <div className="col mt-0 p-0">
            <div className="mt-1 p-0">
              <span className="fw-bold p-0 ms-2 mb-2">4. DECISIONES</span>
              <span className="p-1">
                &nbsp; ACCIONES Y SOLUCIONES INMEDIATAS:&nbsp;&nbsp; &nbsp;
              </span>
              <div className="ms-3 me-4 mt-2">
                <div className="line-box mt-0 align-bottom">
                  <span>{data.acciones}</span>
                </div>
                <div className="line-box mt-1"></div>
                <div className="line-box mt-1 mb-1"></div>
              </div>
            </div>
          </div>
          <div className="col-4 m-0 p-1">
            <div className="fw-bold ms-1 me-5 mb-1">
              OPORTUNIDAD (TPO) RESTABLECIMIENTO:
            </div>
            <div className="line-box p-0 mb-1 me-3">
              <span style={{ fontSize: "12px" }}>{data.oportunidad}</span>
            </div>
            <div className="line-box"></div>
          </div>
        </div>
      </section>

      {/* ================= 5. RECURSOS ================= */}
      <section
        className="p-0 m-0"
        style={{ border: "1px solid", padding: "0px 0px" }}
      >
        <div className="mt-1 p-0 mb-1">
          <span className="fw-bold ms-1 mt-0 p-0">
            5. RECURSOS INVOLUCRADOS
          </span>
          &nbsp;&nbsp; <span>TIPO (HUMANO-MATERIAL)</span>
        </div>
        <div className="line-box me-4 ms-1 mb-1">
          <span style={{ fontSize: "12px" }}>{data.recursos}</span>
        </div>
        <div className="line-box me-4 ms-1 mb-1"></div>
        <div className="line-box me-4 ms-1 mb-1"></div>
      </section>

      {/* ================= 6. EVALUACIÓN ================= */}
      <section style={{ border: "1px solid", padding: "0px 0px" }}>
        <div className="row">
          <div className="col">
            <div className="fw-bold ms-2">6. EVALUACIÓN DE NECESIDADES</div>
            <div className="ms-1" style={{ marginBottom: "60%" }}>
              <table className="m-0 ">
                <thead></thead>
                <tbody className="px-0 ps-1">
                  {[
                    "NO SE REQUIERE",
                    "SE REQUIERE (INDICAR CANTIDAD, TIPO Y MOTIVO)",
                  ].map((tipo) => {
                    return (
                      <tr key={tipo}>
                        <td
                          style={{
                            border: "1px solid",
                            padding: "0px 0px",
                            width: "5%",
                          }}
                          className="text-center"
                        >
                          {data.necesidades.includes("") ? "X" : ""}
                        </td>
                        <td className="ms-5">{tipo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="line-box mt-1"></div>
            </div>
          </div>
          <div className="col">
            {/* ================= 7. CAPACIDAD ================= */}

            <div className="fw-bold mb-2 ms-1">7. NIVELES DE EMERGENCIA</div>
            <div className="mb-2">
              <table className="m-0 ms-1 p-1 me-2">
                <thead></thead>
                <tbody className="m-4">
                  {arrayEmergencia.map((e, i) => {
                    return (
                      <tr className="">
                        <td
                          style={{
                            border: "1px solid",
                            width: "6%",
                            height: "5%",
                          }}
                        ></td>
                        <td className="m-0 mt-0 pt-0" style={{ width: "90%" }}>
                          <span
                            className="fw-bold p-0 m-0"
                            style={{
                              fontSize: "10px",
                              letterSpacing: "-1px",
                              lineHeight: "-1px",
                            }}
                          >
                            {e}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              letterSpacing: "-1px",
                              lineHeight: "-1px",
                            }}
                          >
                            {detalleEmergencia[i]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ================= 8. OBSERVACIONES ================= */}
            <div className="mt-1">
              <div className="fw-bold ms-1 mb-2">8. OBSERVACIONES</div>
              <div className="line-box ms-2 me-3">
                <span style={{ fontSize: "10px" }}>{data.observaciones}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= 9. RESPONSABLE ================= */}
      <section
        style={{
          border: "1px solid",
          padding: "0px 0px",
        }}
      >
        <div className="fw-bold ms-1 mb-2" style={{ marginTop: "0.5px" }}>
          9. RESPONSABLE DEL INFORME
        </div>

        <div className="ms-2 mb-1 d-flex">
          <div className="flex-fill">
            IDENTIFICACIÓN:
            <span className="ms-2">
              <u>{data.funcionario}</u>
            </span>
          </div>
          <div className="flex-fill">
            <span>FECHA: </span>
            <span className="ms-2">{data.fecha_documento}</span>
          </div>
          <div className="flex-fill">
            <span>HORA:</span>
            <span className="ms-2 line-box"></span>
          </div>
        </div>
      </section>
    </div>
  );
});

export default AlfaPDF;
