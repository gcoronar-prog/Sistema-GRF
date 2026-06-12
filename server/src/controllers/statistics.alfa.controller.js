import { pool } from "../db.js";

const getStatisticsAlfa = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const whereClause = buildWhereClause({ fecha_inicio, fecha_fin });
    const query = `${getAllAlfa}`;
    const { rows } = await pool.query(query);
    console.log(fecha_inicio, fecha_fin);
    return res.status(201).json(rows);
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

function buildWhereClause({ fecha_inicio, fecha_fin }) {
  const conditions = [];
  const values = [];

  const addCondition = (cond, ...vals) => {
    conditions.push(cond);
    values.push(...vals);
  };

  if (fecha_inicio && fecha_fin) {
    addCondition(
      `d.fecha_ocurrencia BETWEEN $${values.length + 1} AND $${values.length + 2}`,
      fecha_inicio,
      fecha_fin,
    );
  } else if (fecha_inicio) {
    addCondition(`d.fecha_ocurrencia >= $${values.length + 1}`, fecha_inicio);
  } else if (fecha_fin) {
    addCondition(`d.fecha_ocurrencia >= $${values.length + 1}`, fecha_fin);
  } else if (!fecha_inicio && !fecha_fin) {
    addCondition(
      `d.fecha_ocurrencia >= $${values.length + 1}`,
      "2026-06-12T16:26:20.000Z",
    );
  }
}

export { getStatisticsAlfa };
