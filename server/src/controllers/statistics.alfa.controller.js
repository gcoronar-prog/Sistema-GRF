import { pool } from "../db.js";

const getStatisticsAlfa = async (req, res) => {
  try {
    const { whereClause, values } = buildWhereClause(req.query);
    const consulta =
      values.length > 0 ? `${getAllAlfa} ${whereClause}` : `${getAllAlfa}`;
    const { rows } = await pool.query(consulta, values);
    console.log("where: ", whereClause, values);
    return res.status(201).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
};

const getAllAlfa = `SELECT a.*, b.*,c.*, 
d.*, e.*
FROM informes_alfa a
JOIN danios_alfa b ON a.id_danios=b.id_danios
JOIN evaluacion_alfa c ON a.id_evaluacion=c.id_evaluacion
JOIN eventos_alfa d ON a.id_evento=d.id_evento
JOIN responsable_alfa e ON a.id_responsable=e.id_responsable
WHERE 1=1`;

function buildWhereClause({
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
}) {
  const conditions = [];
  const values = [];

  const addCondition = (cond, ...vals) => {
    conditions.push(cond);
    values.push(...vals);
  };

  if (fechaInicioDoc && fechaFinDoc) {
    addCondition(
      `d.fecha_ocurrencia BETWEEN $${values.length + 1} AND $${values.length + 2}`,
      fechaInicioDoc,
      fechaFinDoc,
    );
  }

  if (montoInicio && montoFin) {
    addCondition(
      `b.monto_danio >= $${values.length + 1} AND b.monto_danio <= $${values.length + 2}`,
      parseInt(montoInicio, 10),
      parseInt(montoFin, 10),
    );
  } /*else if (fechaInicioDoc) {
    addCondition(`d.fecha_ocurrencia >= $${values.length + 1}`, fechaInicioDoc);
  } else if (fechaFinDoc) {
    addCondition(`d.fecha_ocurrencia >= $${values.length + 1}`, fechaFinDoc);
  } else if (!fechaInicioDoc && !fechaFinDoc) {
    addCondition(
      `d.fecha_ocurrencia >= $${values.length + 1}`,
      "2026-06-12T16:26:20.000Z",
    );
  }*/

  if (escala) {
    addCondition(`d.escala_sismo = $${values.length + 1}`, escala);
  }

  if (tipoEventos && tipoEventos.length > 0) {
    const eventos = JSON.stringify(tipoEventos).toLocaleUpperCase();
    addCondition(`d.tipo_evento @> $${values.length + 1}`, eventos);
  }

  if (evaDanios && evaDanios.length > 0) {
    addCondition(`b.ev_danio IN ($${values.length + 1})`, evaDanios);
  }

  if (nivEmergencia && nivEmergencia.length > 0) {
    const emergenciaArray = Array.isArray(nivEmergencia)
      ? nivEmergencia
      : nivEmergencia.split(",");
    addCondition(
      `c.cap_respuesta IN (${emergenciaArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...emergenciaArray,
    );
  }

  if (danioPersonas && danioPersonas.length > 0) {
    const mapaDanioPersonas = {
      Afectadas: "afectadas",
      Damnificadas: "damnificadas",
      Heridas: "heridas",
      Muertas: "muertes",
      Desaparecidas: "desaparecidas",
      Albergados: "albergados",
    };
    const danioArray = Array.isArray(danioPersonas)
      ? danioPersonas
      : danioPersonas.split(",");

    const condicionesDanio = danioArray
      .map((danio) => danio.trim())
      .map((danio) => mapaDanioPersonas[danio])
      .filter(Boolean)
      .map(
        (danio) => `
      (
        COALESCE(NULLIF(b.tipo_afectados #>> '{${danio},hombres}', '')::int, 0) +
        COALESCE(NULLIF(b.tipo_afectados #>> '{${danio},mujeres}', '')::int, 0)
      ) > 0
    `,
      );

    if (condicionesDanio.length > 0) {
      addCondition(`(${condicionesDanio.join(" OR ")})`);
    }
  }

  if (evalNecesidad && evalNecesidad.length > 0) {
    const necesidadArray = Array.isArray(evalNecesidad)
      ? evalNecesidad
      : evalNecesidad.split(",");
    addCondition(
      `c.necesidades IN (${necesidadArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...necesidadArray,
    );
  }

  return {
    whereClause: conditions.length ? " AND " + conditions.join(" AND ") : "",
    values,
  };
}

export { getStatisticsAlfa };
