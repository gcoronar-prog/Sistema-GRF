import { pool } from "../db.js";

const getStatisticsSoliImg = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let soliImagen = `SELECT * FROM solicitudes_imagenes si
                        JOIN datos_solicitud_denuncia dsd ON si.id_denuncia=dsd.id_denuncia
                        JOIN datos_solicitud_grabacion dsg ON si.id_grabacion=dsg.id_grabacion
                        JOIN datos_solicitud_responsable dsr ON si.id_responsable=dsr.id_responsable
                        JOIN datos_solicitud_usuarios dsu ON si.id_usuarios_img=dsu.id_usuarios_img
                        ${whereClause}`;

    const result = await client.query(soliImagen, values);
    await client.query("COMMIT");
    return res.status(200).json({ solicitud: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexion con el servidor" });
  } finally {
    client.release();
  }
};

function buildWhereClause({
  fecha_inicio,
  fecha_fin,
  estado_soli,
  rut_usuario,
  rut_resp,
  fecha_inicio_soli,
  fecha_fin_soli,
  sector,
  entidad,
}) {
  let conditions = [];
  let values = [];

  const addCondition = (cond, ...vals) => {
    conditions.push(cond);
    values.push(...vals);
  };

  if (fecha_inicio && fecha_fin) {
    addCondition(
      `dsu.fecha_solicitud BETWEEN $${values.length + 1} AND $${
        values.length + 2
      }`,
      fecha_inicio,
      fecha_fin
    );
  }

  if (fecha_inicio_soli && fecha_fin_soli) {
    addCondition(
      `dsg.fecha_siniestro BETWEEN $${values.length + 1} AND $${
        values.length + 2
      }`,
      fecha_inicio_soli,
      fecha_fin_soli
    );
  }

  if (rut_resp) {
    addCondition(`dsr.rut_responsable = $${values.length + 1}`, rut_resp);
  }

  if (rut_usuario) {
    addCondition(`dsu.rut_solicitante = $${values.length + 1}`, rut_usuario);
  }

  if (sector && sector.length > 0) {
    addCondition(`dsg.sector_solicitud = $${values.length + 1}`, sector);
  }

  if (estado_soli && estado_soli.length > 0) {
    const estadoArray = Array.isArray(estado_soli)
      ? estado_soli
      : estado_soli.split(", ");
    addCondition(
      `dsg.estado_solicitud IN (${estadoArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...estadoArray
    );
  }

  if (entidad && entidad.length > 0) {
    const entidadArray = Array.isArray(entidad) ? entidad : entidad.split(", ");
    addCondition(
      `dsd.entidad IN (${entidadArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...entidadArray
    );
  }
  return {
    whereClause: conditions.length ? " AND " + conditions.join(" AND ") : "",
    values,
  };
}

export { getStatisticsSoliImg };
