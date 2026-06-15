import { pool } from "../db.js";

const getStatisticsAlfa = async (req, res) => {
  try {
    const { whereClause, values } = buildWhereClause(req.query);
    const consulta = `${getAllAlfa}`;
    const { rows } = await pool.query(getAllAlfa + whereClause, values);
    console.log(whereClause, values, consulta);
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

  if (tipoEventos && tipoEventos.length) {
    const placeholders = tipoEventos
      .map((_, idx) => `$${values.length + idx + 1}`)
      .join(", ");
    addCondition(`d.tipo_evento IN (${placeholders})`, ...tipoEventos);
  }

  return {
    whereClause: conditions.length ? " AND " + conditions.join(" AND ") : "",
    values,
  };
}

export { getStatisticsAlfa };
