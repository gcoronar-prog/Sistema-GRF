import { forwardRef } from "react";
import "./CSS/alfaPrint.css";

const AlfaPDF = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const afectados = Object.fromEntries(
    Object.entries(data.tipo_afectados || {}).map(([k, v]) => [
      k.toUpperCase(),
      v,
    ])
  );

  const ocurrencia =
    data.fecha_ocurrencia.slice(0, 10).split("-").reverse().join("-") +
      data.fecha_ocurrencia.slice(10).replace("T", " HORA: ") || "";

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

  return (
    <div ref={ref} className="alfa-pdf">
      {/* ================= HEADER ================= */}
      <div className="text-center fw-bold mb-2">
        INFORME DE INCIDENTE O EMERGENCIA Nº {data.cod_alfa}
      </div>

      {/* ================= 1. IDENTIFICACIÓN ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold mb-1">1. IDENTIFICACIÓN</div>

        <div className="row">
          <div className="col">REGIÓN: {data.region}</div>
          <div className="col">PROVINCIA: {data.provincia}</div>
          <div className="col">COMUNA: {data.comuna}</div>
        </div>

        <div className="row mt-1">
          <div className="col">FUENTE: {data.fuente_info}</div>
          <div className="col">FONO: {data.telefono}</div>
        </div>
      </section>

      {/* ================= 2. TIPO DE EVENTO ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold mb-1">2. TIPO DE EVENTO</div>

        <br />
        <div className="row">
          <div className="col">
            <div className="col">
              <h6>SISMO (ESCALA MERCALI) </h6>
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
                  <div key={nivel}>
                    <label
                      htmlFor=""
                      style={{
                        borderStyle: data.escala_sismo.includes(nivel)
                          ? "solid"
                          : "none",
                        padding: "1px",
                      }}
                    >
                      {nivel}
                    </label>
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="col">
                  {[
                    "INUNDACIÓN",
                    "TEMPORAL",
                    "DESLIZAMIENTO",
                    "ACT. VOLCÁNICA",
                    "INC. FORESTAL",
                    "OTRO",
                  ].map((evento) => (
                    <div key={evento}>
                      <span className="checkbox">
                        {data.tipo_evento.includes(evento) ? "X" : ""}
                      </span>
                      <span>{evento}</span>
                    </div>
                  ))}
                </div>
                <div className="col">
                  {[
                    "INCENDIO URBANO",
                    "SUST. PELIGROSAS",
                    "ACC. MULT. VÍCTIMAS",
                    "CORTE ENERGÍA ELECT.",
                    "CORTE AGUA POTABLE",
                  ].map((evento) => (
                    <div key={evento}>
                      <span className="checkbox">
                        {data.tipo_evento.includes(evento) ? "X" : ""}
                      </span>
                      <span>{evento}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <strong>DESCRIPCIÓN DEL EVENTO:</strong>
            <div className="line-box">{data.desc_evento}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="mt-1 p-1">
              <div className="col">
                <strong>OCURRENCIA:</strong>
              </div>
              <br />
              <div className="col d-flex">
                <div className="me-auto">
                  <ul className="list-inline">
                    <li className="list-inline-item me-4">{horaOcurrencia}</li>
                    <li className="list-inline-item me-4">{diaOcurrencia}</li>
                    <li className="list-inline-item me-4">{mesOcurrencia}</li>
                    <li className="list-inline-item me-4">{anioOcurrencia}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="mt-1 p-1">
              <strong>DIRECCIÓN / UBICACIÓN:</strong>
              <div className="me-1 p-1">{data.direccion}</div>
            </div>
          </div>
          <div className="col-1 me-1">
            <div
              className="row p-2"
              style={{ borderStyle: "solid", borderWidth: "1px" }}
            >
              U {data.tipo_ubicacion.includes("Urbana") ? "X" : ""}
            </div>
            <div
              className="row p-2"
              style={{ borderStyle: "solid", borderWidth: "1px" }}
            >
              R {data.tipo_ubicacion.includes("Rural") ? "X" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. DAÑOS ================= */}
      <section className="border p-2 mb-2">
        <div className="row">
          <div className="col border">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <table className="m-0 " style={{ width: "30%" }}>
                  <thead>
                    <tr>
                      <th className="p-2">
                        <span className="fw-bold m-0 text-break">
                          3. DAÑOS PERSONAS
                        </span>
                      </th>
                      <th
                        style={{ width: "16%" }}
                        className="text-center align-bottom p-2"
                      >
                        H
                      </th>
                      <th
                        style={{ width: "16%" }}
                        className="text-center align-bottom p-2"
                      >
                        M
                      </th>
                      <th className="text-center align-bottom p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="px-0 ps-1">
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
                        <tr key={tipo}>
                          <td className="px-1 ms-0 ps-0">{tipo}</td>
                          <td className="px-1 text-center border">{h}</td>
                          <td className="px-1 text-center border">{m}</td>
                          <td className="px-1 text-center border">{h + m}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col me-n4 mt-3">
                <div className="fw-bold mb-1 ">VIVIENDAS</div>
                {[
                  "DAÑO MENOR HABITABLE",
                  "DAÑO MAYOR NO HABITABLE",
                  "DESTRUIDAS, IRRECUPERABLE",
                ].map((danio) => (
                  <div className="row" key={danio}>
                    <div className="col m-0 p-0">
                      <span style={{ fontSize: "10px" }}>{danio}</span>
                    </div>

                    <div className="col-auto m-0 p-0">
                      <table
                        className="table table-bordered m-0 me-1"
                        style={{ width: "46px", tableLayout: "fixed" }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ height: "26px" }}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
                <br />
                <br />
                <div className="row">
                  <div className="col m-0 p-0 mt-2">
                    <span>NO EVALUADAS</span>
                  </div>
                  <div className="col-auto m-0 p-0">
                    <table
                      className="table table-bordered m-0 me-1"
                      style={{ width: "46px", tableLayout: "fixed" }}
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
          <div className="col p-0 ms-3 d-flex flex-column">
            <div className="mt-3">
              <strong>SERVICIOS BÁSICOS, INFRAESTRUCTURAS Y OTROS:</strong>
              <div className="me-1 p-1">{data.danio_vivienda}</div>
            </div>
            <div className="mt-auto">
              <strong>MONTO ESTIMADO DE DAÑOS ($):</strong> {data.monto_danio}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. ACCIONES ================= */}
      <section className="border p-2">
        <div className="row g-2">
          <div className="col mt-0 p-0">
            <div className="mt-0 p-0">
              <span className="fw-bold mt-0 p-0 ms-1">4. DECISIONES</span>
              <span className="p-1">
                &nbsp; ACCIONES Y SOLUCIONES INMEDIATAS:&nbsp;&nbsp; &nbsp;
              </span>
              <div className="ms-3 me-4">
                <div className="line-box mt-0 align-bottom">
                  <span>{data.acciones}</span>
                </div>
                <div className="line-box mt-0"></div>
                <div className="line-box mt-0"></div>
              </div>
            </div>
          </div>
          <div className="col-4 m-0 p-1">
            <div className="fw-bold ms-1 me-1">
              OPORTUNIDAD (TPO) RESTABLECIMIENTO:
            </div>
            <div className="line-box p-0">{data.oportunidad}</div>
            <div className="line-box"></div>
          </div>
        </div>
      </section>

      {/* ================= 5. RECURSOS ================= */}
      <section className="border p-0 m-0">
        <div className="mt-0 p-0">
          <span className="fw-bold ms-1 mt-0 p-0">
            5. RECURSOS INVOLUCRADOS
          </span>
          &nbsp;&nbsp; <span>TIPO (HUMANO-MATERIAL)</span>
        </div>
        <div className="line-box me-4 ms-1">{data.recursos}</div>
        <div className="line-box me-4 ms-1"></div>
        <div className="line-box me-4 ms-1"></div>
      </section>

      {/* ================= 6. EVALUACIÓN ================= */}
      <section className="border">
        <div className="row">
          <div className="col">
            <div className="fw-bold ms-2">6. EVALUACIÓN DE NECESIDADES</div>
            <div className="ms-1">
              <table className="m-0 ">
                <thead></thead>
                <tbody className="px-0 ps-1">
                  {[
                    "NO SE REQUIERE",
                    "SE REQUIERE (INDICAR CANTIDAD, TIPO Y MOTIVO)",
                  ].map((tipo) => {
                    return (
                      <tr key={tipo}>
                        <td className="border">
                          {data.necesidades.includes("") ? "X" : ""}
                        </td>
                        <td className="ms-5">{tipo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col">
            {/* ================= 7. CAPACIDAD ================= */}

            <div className="fw-bold">7. NIVELES DE EMERGENCIA</div>
            <table className="m-0">
              <thead></thead>
              <tbody>
                {/*  {arrayEmergencia.map((emer) => {
                    return (
                      <tr key={emer}>
                        <td className="border"></td>
                        <td>{emer}</td>
                      </tr>
                    );
                  })}
                  {detalleEmergencia.map((emerg) => {
                    return (
                      <tr key={emerg}>
                        <td className="border"></td>
                        <td>{emerg}</td>
                      </tr>
                    );
                  })}*/}
                {arrayEmergencia.map((e, i) => {
                  return (
                    <tr>
                      <td className="border" style={{ width: "5%" }}></td>
                      <td>
                        <span>{e}</span>
                        <span style={{ fontSize: "7px" }}>
                          {detalleEmergencia[i]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ================= 8. OBSERVACIONES ================= */}

            <div className="fw-bold">8. OBSERVACIONES</div>
            <div className="line-box">{data.observaciones}</div>
          </div>
        </div>
      </section>
      {/* ================= 9. RESPONSABLE ================= */}
      <section className="border p-2">
        <div className="fw-bold">9. RESPONSABLE DEL INFORME</div>
        <div>Nombre: {data.funcionario}</div>
        <div>Fecha: {data.fecha_documento}</div>
      </section>
    </div>
  );
});

export default AlfaPDF;
