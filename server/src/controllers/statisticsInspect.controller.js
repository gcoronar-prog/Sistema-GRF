import { pool } from "../db.js";

const getStatisticInspect = async (req, res) => {
  const client = await pool.connect();

  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let expedientes = `SELECT expe.* , 
            infra.* as infra,
            contri.* as contri, 
            vehi.* as vehi,
            funci.* as funci

            FROM expedientes expe
            JOIN infracciones infra
            ON infra.id_expediente = expe.id_expediente
            JOIN contribuyentes contri 
            ON contri.id_expediente=expe.id_expediente
            JOIN vehiculos_contri vehi
            ON vehi.id_expediente=expe.id_expediente
            JOIN funcionarios funci
	        ON funci.id_funcionario=expe.id_inspector
        WHERE 1=1 ${whereClause}`;

    const result = await client.query(expedientes, values);
    await client.query("COMMIT");
    console.log("expediente: ", expedientes);

    return res.status(200).json({
      expedientes: result.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getEstadoExpe = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let estadoInspeccion = `SELECT DISTINCT estado_exp, 
                              tipo_procedimiento ,
                              COUNT(id_exp) as cantidad
                              FROM  expedientes expe
                              JOIN infracciones infra
                              ON infra.id_expediente = expe.id_expediente
                              JOIN contribuyentes contri 
                              ON contri.id_expediente=expe.id_expediente
                              JOIN vehiculos_contri vehi
                              ON vehi.id_expediente=expe.id_expediente
                              JOIN funcionarios funci
                              ON funci.id_funcionario=expe.id_inspector
                            WHERE 1=1 AND estado_exp IS NOT NULL AND tipo_procedimiento IS NOT NULL ${whereClause}
                            GROUP BY estado_exp, tipo_procedimiento ORDER BY estado_exp, tipo_procedimiento`;

    const result = await client.query(estadoInspeccion, values);

    await client.query("COMMIT");

    console.log("controller estado", estadoInspeccion);

    return res.status(200).json({ expedientes: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getTipoProce = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");
    let tipoProceso = `SELECT DISTINCT tipo_procedimiento, 
                              funci.funcionario,
                              COUNT(id_exp) as cantidad
                              FROM  expedientes expe
                              JOIN infracciones infra
                              ON infra.id_expediente = expe.id_expediente
                              JOIN contribuyentes contri 
                              ON contri.id_expediente=expe.id_expediente
                              JOIN vehiculos_contri vehi
                              ON vehi.id_expediente=expe.id_expediente
                              JOIN funcionarios funci
                              ON funci.id_funcionario=expe.id_inspector
                              WHERE 1=1 AND tipo_procedimiento IS NOT NULL ${whereClause}
                              GROUP BY funci.funcionario,tipo_procedimiento
                              ORDER BY tipo_procedimiento`;

    const result = await client.query(tipoProceso, values);
    await client.query("COMMIT");
    return res.status(200).json({ expedientes: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getLeyesInsp = async (req, res) => {
  const client = await pool.connect();

  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let leyesResumen = `SELECT DISTINCT l.ley,
                          expe.tipo_procedimiento,
                          infra.juzgado,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM expedientes expe
                        JOIN infracciones infra
                        ON infra.id_expediente=expe.id_expediente
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        WHERE 1=1 AND l.ley IS NOT NULL AND expe.tipo_procedimiento IS NOT NULL ${whereClause}
                        GROUP BY l.ley,expe.tipo_procedimiento,infra.juzgado
                        ORDER BY l.ley`;

    const result = await client.query(leyesResumen, values);
    await client.query("COMMIT");
    return res.status(200).json({ expedientes: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getInspectResumen = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");
    let inspectResumen = `SELECT DISTINCT  
		func.funcionario,
		expe.tipo_procedimiento,
		COUNT(expe.id_expediente) AS cantidad
    FROM expedientes expe 
    JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
    JOIN funcionarios func on expe.id_inspector=func.id_funcionario
    WHERE 1=1 AND func.funcionario IS NOT NULL ${whereClause}
    GROUP BY expe.id_inspector,expe.tipo_procedimiento,func.funcionario
    ORDER BY func.funcionario`;

    const result = await client.query(inspectResumen, values);
    await client.query("COMMIT");
    return res.status(200).json({ expedientes: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getVehiculoResumen = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");
    let vehiResumen = `SELECT DISTINCT vehi.tipo_vehi,
                            vehi.marca_vehi,
                            COUNT(vehi.id_vehiculos) AS cantidad
                          FROM vehiculos_contri vehi
                            JOIN expedientes expe ON expe.id_expediente=vehi.id_expediente
                            JOIN infracciones infra ON expe.id_expediente=infra.id_expediente                      
                        WHERE 1=1 AND  vehi.tipo_vehi IS NOT NULL ${whereClause}
                         GROUP BY vehi.tipo_vehi,vehi.marca_vehi 
                          ORDER BY vehi.tipo_vehi`;

    const result = await client.query(vehiResumen, values);
    await client.query("COMMIT");
    return res.status(200).json({ expedientes: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getSectorInfra = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");
    let sectorResumen = `SELECT infra.sector_infraccion, 
                          expe.id_inspector,
                          expe.tipo_procedimiento,
                          COUNT(expe.id_expediente) as cantidad
                          FROM infracciones infra
                          JOIN expedientes expe ON expe.id_expediente=infra.id_expediente
                          WHERE infra.sector_infraccion IS NOT NULL ${whereClause}
                        GROUP BY infra.sector_infraccion, expe.id_inspector,expe.tipo_procedimiento 
                          ORDER BY infra.sector_infraccion`;

    const result = await client.query(sectorResumen, values);
    await client.query("COMMIT");
    return res.status(200).json({ expedientes: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getGlosasResumen = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");
    let glosaResumen = `SELECT expe.tipo_procedimiento,
                          gl.glosa_ley,
                          l.ley,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM expedientes expe
                        JOIN glosas_ley gl ON gl.id_glosa=expe.id_glosas
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
                        WHERE gl.glosa_ley IS NOT NULL ${whereClause}
                        GROUP BY expe.tipo_procedimiento,gl.glosa_ley,l.ley 
                          ORDER BY expe.tipo_procedimiento`;

    const result = await client.query(glosaResumen, values);
    await client.query("COMMIT");
    return res.status(200).json({ expedientes: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

function buildWhereClause({
  fechaInicioInfrac,
  fechaFinInfrac,
  fechaInicioCitacion,
  fechaFinCitacion,
  fechaInicio,
  fechaFin,

  estado_exp,
  tipo_proce,
  jpl,
  user_creador,
  leyes,
  inspector,

  rut_contri,
  tipo_vehiculo,
  marca_vehiculo,
  sector_infraccion,
}) {
  const conditions = [];
  const values = [];

  const addCondition = (cond, ...vals) => {
    conditions.push(cond);
    values.push(...vals);
  };

  if (fechaInicioInfrac && fechaFinInfrac) {
    addCondition(
      `infra.fecha_infraccion BETWEEN $${values.length + 1} AND $${
        values.length + 2
      }`,
      fechaInicioInfrac,
      fechaFinInfrac
    );
  }

  if (fechaInicioCitacion && fechaFinCitacion) {
    addCondition(
      `infra.fecha_citacion BETWEEN $${values.length + 1} AND $${
        values.length + 2
      }`,
      fechaInicioInfrac,
      fechaFinInfrac
    );
  }

  // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
  if (fechaInicio && fechaFin) {
    addCondition(
      `infra.fecha_resolucion BETWEEN $${values.length + 1} AND $${
        values.length + 2
      }`,
      fechaInicio,
      fechaFin
    );
  }

  if (estado_exp && estado_exp.length > 0) {
    const estadosArray = Array.isArray(estado_exp)
      ? estado_exp
      : estado_exp.split(",");
    addCondition(
      `expe.estado_exp IN (${estadosArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...estadosArray
    );
  }

  if (tipo_proce && tipo_proce.length > 0) {
    const procesoArray = Array.isArray(tipo_proce)
      ? tipo_proce
      : tipo_proce.split(",");

    addCondition(
      `expe.tipo_procedimiento IN (${procesoArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...procesoArray
    );
  }

  if (jpl && jpl.length > 0) {
    const jplArray = Array.isArray(jpl) ? jpl : jpl.split(",");
    addCondition(
      `expe.tipo_procedimiento IN (${jplArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...jplArray
    );
  }

  if (leyes && leyes.length > 0) {
    addCondition(`expe.id_leyes=$${values.length + 1}`, leyes);
  }

  if (inspector && inspector.length > 0) {
    const cleanedInspector = inspector.replace(/"/g, "");
    addCondition(`expe.id_inspector= $${values.length + 1}`, cleanedInspector);
  }

  if (rut_contri && rut_contri.length > 0) {
    addCondition(`contri.rut_contri = $${values.length + 1}`, rut_contri);
  }

  if (tipo_vehiculo && tipo_vehiculo.length > 0) {
    const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
    addCondition(`vehi.tipo_vehi= $${values.length + 1}`, cleanedTipo);
  }

  if (marca_vehiculo && marca_vehiculo.length > 0) {
    const cleanedMarca = marca_vehiculo.replace(/"/g, "");
    addCondition(`vehi.marca_vehi = $${values.length + 1}`, cleanedMarca);
  }

  if (sector_infraccion && sector_infraccion.length > 0) {
    const cleanedSector = sector_infraccion.replace(/"/g, "");
    addCondition(
      `infra.sector_infraccion= $${values.length + 1}`,
      cleanedSector
    );
  }

  if (user_creador && user_creador.length > 0) {
    const cleanedDigitador = user_creador.replace(/"/g, "");
    addCondition(`expe.user_creador= $${values.length + 1}`, cleanedDigitador);
  }

  return {
    whereClause: conditions.length ? " AND " + conditions.join(" AND ") : "",
    values,
  };
}

export {
  getStatisticInspect,
  getEstadoExpe,
  getTipoProce,
  getLeyesInsp,
  getInspectResumen,
  getVehiculoResumen,
  getSectorInfra,
  getGlosasResumen,
};
