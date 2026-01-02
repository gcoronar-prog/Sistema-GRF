import { forwardRef } from "react";
import "./CSS/alfaPrint.css";

const AlfaPDF = forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} className="alfa-pdf">
      {/* ================= HEADER ================= */}
      <div className="text-center fw-bold mb-2">
        INFORME DE INCIDENTE O EMERGENCIA Nº {data.id_reporte}
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

        <div className="eventos-grid">
          {[
            "SISMO",
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
          ].map((evento) => (
            <div key={evento}>
              <span className="checkbox">
                {data.tipo_evento.includes(evento) ? "X" : ""}
              </span>
              {evento}
            </div>
          ))}
        </div>

        <div className="mt-1">
          <strong>DESCRIPCIÓN DEL EVENTO:</strong>
          <div className="line-box">{data.desc_evento}</div>
        </div>

        <div className="mt-1">
          <strong>DIRECCIÓN / UBICACIÓN:</strong>
          <div className="line-box">{data.direccion}</div>
        </div>

        <div className="row mt-1">
          <div className="col">HORA: {data.hora}</div>
          <div className="col">DÍA: {data.dia}</div>
          <div className="col">MES: {data.mes}</div>
          <div className="col">AÑO: {data.anio}</div>
        </div>
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
              const h = data.tipo_afectados[tipo]?.hombres || 0;
              const m = data.tipo_afectados[tipo]?.mujeres || 0;
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
        <div>Nombre: {data.responsable}</div>
        <div>Fecha: {data.fecha}</div>
        <div>Hora: {data.hora_reporte}</div>
      </section>
    </div>
  );
});

export default AlfaPDF;
