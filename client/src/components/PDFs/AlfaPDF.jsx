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
            <div className="escala-grid">
              <h6>SISMO (ESCALA MERCALI) </h6>
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
            <br />
            <div className="eventos-grid">
              {[
                "INUNDACIÓN",
                "TEMPORAL",
                "DESLIZAMIENTO",
                "ACT. VOLCÁNICA",
                "INC. FORESTAL",
                "INCENDIO URBANO",
                "SUST. PELIGROSAS",
                "ACC. MULT. VÍCTIMAS",
                "CORTE ENERGÍA",
                "CORTE AGUA",
                "OTRO",
              ].map((evento) => (
                <div className="evento-item" key={evento}>
                  <span className="checkbox">
                    {data.tipo_evento.includes(evento) ? "X" : ""}
                  </span>
                  <span className="evento-texto">{evento}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col">
            <div className="mt-1">
              <strong>DESCRIPCIÓN DEL EVENTO:</strong>
              <div className="line-box">{data.desc_evento}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="mt-1">
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
            <div className="mt-1">
              <strong>DIRECCIÓN / UBICACIÓN:</strong>
              <div className="">{data.direccion}</div>
            </div>
          </div>
          <div className="col-1">
            <div
              className="row"
              style={{ borderStyle: "solid", borderWidth: "1px" }}
            >
              U {data.tipo_ubicacion.includes("Urbana") ? "X" : ""}
            </div>
            <div
              className="row"
              style={{ borderStyle: "solid", borderWidth: "1px" }}
            >
              R {data.tipo_ubicacion.includes("Rural") ? "X" : ""}
            </div>
          </div>
        </div>

        {/* <div className="row mt-1">
          <div className="col">HORA: {data.hora}</div>
          <div className="col">DÍA: {data.dia}</div>
          <div className="col">MES: {data.mes}</div>
          <div className="col">AÑO: {data.anio}</div>
        </div>*/}
      </section>

      {/* ================= 3. DAÑOS ================= */}
      <section className="border p-2 mb-2">
        <div className="fw-bold mb-1">3. DAÑOS</div>

        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th></th>
              <th>H</th>
              <th>M</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {[
              "AFECTADAS",
              "DAMNIFICADAS",
              "HERIDAS",
              "MUERTAS",
              "DESAPARECIDAS",
              "ALBERGADOS",
            ].map((tipo) => {
              const h = afectados[tipo]?.hombres || 0;
              const m = afectados[tipo]?.mujeres || 0;
              return (
                <tr key={tipo}>
                  <td>{tipo}</td>
                  <td>{h}</td>
                  <td>{m}</td>
                  <td>{h + m}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
