import { pool } from "../db.js";

const getStatisticSGC = async (req, res) => {
  const client = await pool.connect();

  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let atencionSGC = `SELECT * FROM atencion_ciudadana ac 
            JOIN datos_atencion_usuario dau ON ac.id_atencion_usuario=dau.id_atencion_usuarios
            JOIN datos_atencion_sector das ON ac.id_atencion_sector=das.id_atencion_sector
            JOIN datos_atencion_solicitud daso ON ac.id_atencion_solicitud=daso.id_atencion_solicitud
            JOIN datos_atencion_procesos dap ON ac.id_atencion_solicitud=dap.id_atencion_proceso 
            WHERE 1=1 ${whereClause}`;
    const result = await client.query(atencionSGC, values);
    //console.log(result);
    await client.query("COMMIT");
    return res.status(200).json({ atencion: result.rows });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const resumenEstado = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let resumenEstado = `SELECT dap.estado_solicitud AS estado, dap.tipo_solicitud AS tipo,  count(*) AS cantidad 
			FROM atencion_ciudadana ac 
            JOIN datos_atencion_usuario dau ON ac.id_atencion_usuario=dau.id_atencion_usuarios
            JOIN datos_atencion_sector das ON ac.id_atencion_sector=das.id_atencion_sector
            JOIN datos_atencion_solicitud daso ON ac.id_atencion_solicitud=daso.id_atencion_solicitud
            JOIN datos_atencion_procesos dap ON ac.id_atencion_solicitud=dap.id_atencion_proceso 
			WHERE dap.estado_solicitud IS NOT NULL ${whereClause}
			GROUP BY ROLLUP (estado, tipo)
			HAVING dap.estado_solicitud IS NOT NULL
			ORDER BY estado, tipo NULLS FIRST`;

    let totalGeneral = `SELECT COUNT(*) FROM atencion_ciudadana ac 
            JOIN datos_atencion_usuario dau ON ac.id_atencion_usuario=dau.id_atencion_usuarios
            JOIN datos_atencion_sector das ON ac.id_atencion_sector=das.id_atencion_sector
            JOIN datos_atencion_solicitud daso ON ac.id_atencion_solicitud=daso.id_atencion_solicitud
            JOIN datos_atencion_procesos dap ON ac.id_atencion_solicitud=dap.id_atencion_proceso 
            WHERE 1=1 ${whereClause}`;

    const resultEstado = await client.query(resumenEstado, values);
    const totalResult = await client.query(totalGeneral, values);

    const agrupado = {};
    resultEstado.rows.forEach((row) => {
      const { estado, tipo, cantidad } = row;
      if (!agrupado[estado]) {
        agrupado[estado] = [];
      }

      agrupado[estado].push({ tipo, cantidad: parseInt(cantidad) });
    });
    const resultado = Object.entries(agrupado).map(([estado, tipo]) => ({
      estado,
      tipo,
    }));
    await client.query("COMMIT");
    return res
      .status(200)
      .json({ resumen: resultado, total: totalResult.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  } finally {
    client.release();
  }
};

function buildWhereClause({
  fecha_solicitud_inicio,
  fecha_solicitud_fin,
  estado_solicitud,
  tipo_solicitud,
  sector_solicitud,
  poblacion,
  jjvv,
}) {
  let conditions = [];
  let values = [];

  const addCondition = (cond, ...vals) => {
    conditions.push(cond);
    values.push(...vals);
  };

  if (fecha_solicitud_inicio && fecha_solicitud_fin) {
    addCondition(
      `ac.fecha_solicitud BETWEEN $${values.length + 1} AND $${
        values.length + 2
      }`,
      fecha_solicitud_inicio,
      fecha_solicitud_fin
    );
  }

  if (estado_solicitud && estado_solicitud.length > 0) {
    const estadoArray = Array.isArray(estado_solicitud)
      ? estado_solicitud
      : estado_solicitud.split(", ");

    addCondition(
      `dap.estado_solicitud IN (${estadoArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...estadoArray
    );
  }

  if (tipo_solicitud && tipo_solicitud.length > 0) {
    const tipoArray = Array.isArray(tipo_solicitud)
      ? tipo_solicitud
      : tipo_solicitud.split(", ");
    addCondition(
      `dap.tipo_solicitud IN (${tipoArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...tipoArray
    );
  }

  if (sector_solicitud && sector_solicitud.length > 0) {
    addCondition(
      `das.sector_solicitante IN ($${values.length + 1})`,
      sector_solicitud
    );
  }

  if (poblacion && poblacion.length > 0) {
    addCondition(
      `das.poblacion_solicitante IN ($${values.length + 1})`,
      poblacion
    );
  }
  if (jjvv && jjvv.length > 0) {
    addCondition(`das.junta_vecinos IN ($${values.length + 1})`, jjvv);
  }

  return {
    whereClause: conditions.length ? " AND " + conditions.join(" AND ") : "",
    values,
  };
}

export { getStatisticSGC, resumenEstado };
