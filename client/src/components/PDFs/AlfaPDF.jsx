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
        <div className="fw-bold mb-1">3. DAÑOS</div>
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <table
                  className="table table-bordered table-sm m-0 mx-auto"
                  style={{ width: "25%" }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "52%" }}></th>
                      <th style={{ width: "16%" }} className="text-center p-2">
                        H
                      </th>
                      <th style={{ width: "16%" }} className="text-center p-2">
                        M
                      </th>
                      <th style={{ width: "16%" }} className="text-center">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="px-0 ps-1">
                    {[
                      "AFECTADAS",
                      "DAMNIFICADAS",
                      "HERIDAS",
                      "MUERTAS",
                      "DESAPARECIDAS",
                      "ALBERGADOS",
                    ].map((tipo) => {
                      const h = afectados[tipo]?.hombres || "";
                      const m = afectados[tipo]?.mujeres || "";
                      return (
                        <tr key={tipo}>
                          <td className="px-1">{tipo}</td>
                          <td className="px-1 text-center">{h}</td>
                          <td className="px-1 text-center">{m}</td>
                          <td className="px-1 text-center">{h + m}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col me-n4" style={{ border: "solid" }}>
                <div className="fw-bold mb-1">VIVIENDAS</div>
                {[
                  "DAÑO MENOR HABITABLE",
                  "DAÑO MAYOR NO HABITABLE",
                  "DESTRUIDAS, IRRECUPERABLES",
                ].map((danio) => (
                  <div className="row" key={danio}>
                    <div className="col m-0 p-0">
                      <span style={{ fontSize: "10px" }}>{danio}</span>
                    </div>

                    <div className="col-auto m-0 p-0">
                      <table
                        className="table table-bordered m-0"
                        style={{ width: "40px", tableLayout: "fixed" }}
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
                  <div className="col">
                    <span>NO EVALUADAS</span>
                  </div>
                  <div className="col ps-0">
                    <table className="table table-bordered m-0 ms-n1 w-50">
                      <tbody>
                        <tr>
                          <td style={{ height: "26px" }}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col p-0 ms-5">
            <div className="mt-1">
              <strong>SERVICIOS BÁSICOS, INFRAESTRUCTURAS Y OTROS:</strong>
              <div className="me-1 p-1">{data.danio_vivienda}</div>
            </div>
          </div>
        </div>

        <div className="mt-1">
          <strong>MONTO ESTIMADO DE DAÑOS ($):</strong> {data.monto_danio}
        </div>
      </section>

      {/* ================= 4. ACCIONES ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold">
          4. DECISIONES, ACCIONES Y SOLUCIONES INMEDIATAS
        </div>
        <div className="line-box">{data.acciones}</div>
      </section>

      {/* ================= 5. RECURSOS ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold">5. RECURSOS INVOLUCRADOS</div>
        <div className="line-box">{data.recursos}</div>
      </section>

      {/* ================= 6. EVALUACIÓN ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold">6. EVALUACIÓN DE NECESIDADES</div>
        <div>{data.necesidades}</div>
      </section>

      {/* ================= 7. CAPACIDAD ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold">7. CAPACIDAD DE RESPUESTA</div>
        <div>NIVEL: {data.cap_respuesta}</div>
      </section>

      {/* ================= 8. OBSERVACIONES ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold">8. OBSERVACIONES</div>
        <div className="line-box">{data.observaciones}</div>
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
