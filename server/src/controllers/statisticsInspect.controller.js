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
    let totalEstados = `SELECT COUNT(*) FROM expedientes expe
      JOIN infracciones infra ON infra.id_expediente = expe.id_expediente
      JOIN contribuyentes contri ON contri.id_expediente=expe.id_expediente
      JOIN vehiculos_contri vehi ON vehi.id_expediente=expe.id_expediente
      JOIN funcionarios funci ON funci.id_funcionario=expe.id_inspector ${whereClause}`;

    /*let estadoInspeccion = `SELECT DISTINCT estado_exp, 
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
                            GROUP BY estado_exp, tipo_procedimiento ORDER BY estado_exp, tipo_procedimiento`;*/

    let estadoInspeccion = `SELECT 
                            expe.tipo_procedimiento AS proceso,
                            expe.estado_exp AS estado,
                            COUNT(expe.estado_exp) AS cantidad

                          FROM expedientes expe
                          JOIN infracciones infra ON infra.id_expediente = expe.id_expediente
                          JOIN contribuyentes contri ON contri.id_expediente = expe.id_expediente
                          JOIN vehiculos_contri vehi ON vehi.id_expediente = expe.id_expediente
                          JOIN funcionarios funci ON funci.id_funcionario = expe.id_inspector

                          WHERE expe.estado_exp IS NOT NULL ${whereClause}

                          GROUP BY ROLLUP(expe.estado_exp, expe.tipo_procedimiento)
                          HAVING NOT (expe.estado_exp IS NULL AND expe.tipo_procedimiento IS NULL)
                          ORDER BY estado, proceso NULLS LAST
                          `;

    const resultEstado = await client.query(estadoInspeccion, values);
    const resultTotalEstado = await client.query(totalEstados, values);

    const agrupado = {};
    resultEstado.rows.forEach((row) => {
      const { proceso, estado, cantidad } = row;
      if (!agrupado[estado]) {
        agrupado[estado] = [];
      }

      agrupado[estado].push({ proceso, cantidad: parseInt(cantidad) });
    });
    const respuesta = Object.entries(agrupado).map(([estado, datos]) => ({
      estado,
      datos,
    }));

    await client.query("COMMIT");

    console.log("controller estado", estadoInspeccion);
    console.log("informe estados", JSON.stringify(respuesta, null, 2));
    return res
      .status(200)
      .json({ expedientes: respuesta, total: resultTotalEstado.rows });
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

    let totalProceso = `SELECT COUNT(*) FROM  expedientes expe
                          JOIN infracciones infra ON infra.id_expediente = expe.id_expediente
                          JOIN contribuyentes contri ON contri.id_expediente=expe.id_expediente
                          JOIN vehiculos_contri vehi ON vehi.id_expediente=expe.id_expediente
                          JOIN funcionarios funci ON funci.id_funcionario=expe.id_inspector ${whereClause}`;

    /*let tipoProceso = `SELECT DISTINCT tipo_procedimiento, 
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
                              ORDER BY tipo_procedimiento`;*/

    let tipoProceso = `SELECT 
                          expe.tipo_procedimiento AS procesos,
                          funci.funcionario AS funcionarios,
                          COUNT(expe.tipo_procedimiento) as cantidad
                          FROM  expedientes expe
                        JOIN infracciones infra ON infra.id_expediente = expe.id_expediente
                        JOIN contribuyentes contri ON contri.id_expediente=expe.id_expediente
                        JOIN vehiculos_contri vehi ON vehi.id_expediente=expe.id_expediente
                        JOIN funcionarios funci ON funci.id_funcionario=expe.id_inspector
                          WHERE funci.funcionario IS NOT NULL ${whereClause}
                        GROUP BY ROLLUP(expe.tipo_procedimiento,funci.funcionario)
                        HAVING NOT (expe.tipo_procedimiento IS NULL)
                        ORDER BY procesos,funcionarios NULLS LAST`;

    const result = await client.query(tipoProceso, values);
    const resultTotalProce = await client.query(totalProceso, values);

    const agrupado = {};
    result.rows.forEach((row) => {
      const { procesos, funcionarios, cantidad } = row;
      if (!agrupado[procesos]) {
        agrupado[procesos] = [];
      }
      agrupado[procesos].push({
        funcionarios,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([procesos, datos]) => ({
      procesos,
      datos,
    }));
    console.log(JSON.stringify(respuesta, null, 2));
    await client.query("COMMIT");
    return res
      .status(200)
      .json({ expedientes: respuesta, total: resultTotalProce.rows });
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
    let totalLeyes = `SELECT COUNT(*) FROM expedientes expe
                        JOIN infracciones infra
                        ON infra.id_expediente=expe.id_expediente
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        ${whereClause}`;

    let leyesResumen = `SELECT l.ley AS ley,
                          expe.tipo_procedimiento AS proceso,
                          infra.juzgado AS juzgado,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM expedientes expe
                        JOIN infracciones infra
                        ON infra.id_expediente=expe.id_expediente
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        WHERE 1=1 AND l.ley IS NOT NULL AND expe.tipo_procedimiento IS NOT NULL ${whereClause}
                        GROUP BY ROLLUP( l.ley,infra.juzgado,expe.tipo_procedimiento)
                        HAVING infra.juzgado IS NOT NULL
                        ORDER BY ley,proceso,juzgado NULLS LAST`;

    const result = await client.query(leyesResumen, values);
    const resultTotal = await client.query(totalLeyes, values);

    const agrupado = {};
    result.rows.forEach((row) => {
      const { ley, proceso, juzgado, cantidad } = row;
      if (!agrupado[ley]) {
        agrupado[ley] = [];
      }
      agrupado[ley].push({
        proceso,
        juzgado,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([ley, datos]) => ({
      ley,
      datos,
    }));
    console.log(JSON.stringify(respuesta, null, 2));

    await client.query("COMMIT");
    return res
      .status(200)
      .json({ expedientes: respuesta, total: resultTotal.rows });
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

    let totalInspect = `SELECT COUNT(*) FROM expedientes expe 
                        JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
                        JOIN funcionarios func on expe.id_inspector=func.id_funcionario
                        WHERE func.funcionario IS NOT NULL ${whereClause}`;

    let inspectResumen = `SELECT  
                          func.funcionario AS inspect,
                          expe.tipo_procedimiento AS proceso,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM expedientes expe 
                          JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
                          JOIN funcionarios func on expe.id_inspector=func.id_funcionario
                          ${whereClause}
                          GROUP BY ROLLUP(func.funcionario,expe.tipo_procedimiento)
                          HAVING NOT (func.funcionario IS NULL AND expe.tipo_procedimiento IS NULL)
                          ORDER BY inspect,proceso NULLS LAST`;

    const result = await client.query(inspectResumen, values);
    const resultTotal = await client.query(totalInspect, values);

    const agrupado = {};
    result.rows.forEach((row) => {
      const { inspect, proceso, cantidad } = row;
      if (!agrupado[inspect]) {
        agrupado[inspect] = [];
      }
      agrupado[inspect].push({
        proceso,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([inspect, datos]) => ({
      inspect,
      datos,
    }));
    console.log(JSON.stringify(respuesta, null, 2));

    await client.query("COMMIT");
    return res
      .status(200)
      .json({ expedientes: respuesta, total: resultTotal.rows });
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

    let totalVehiculo = `SELECT COUNT(*) FROM vehiculos_contri vehi
                            JOIN expedientes expe ON expe.id_expediente=vehi.id_expediente
                            JOIN infracciones infra ON expe.id_expediente=infra.id_expediente                      
                        WHERE vehi.tipo_vehi IS NOT NULL ${whereClause}`;

    let vehiResumen = `SELECT vehi.tipo_vehi AS tipo,
                            vehi.marca_vehi AS marca,
                            COUNT(vehi.id_vehiculos) AS cantidad
                          FROM vehiculos_contri vehi
                            JOIN expedientes expe ON expe.id_expediente=vehi.id_expediente
                            JOIN infracciones infra ON expe.id_expediente=infra.id_expediente                      
                        WHERE vehi.tipo_vehi IS NOT NULL ${whereClause}
                         GROUP BY ROLLUP( vehi.marca_vehi,vehi.tipo_vehi )
                        HAVING NOT (vehi.marca_vehi IS NULL AND vehi.tipo_vehi IS NULL)
                          ORDER BY marca,tipo NULLS LAST`;

    const result = await client.query(vehiResumen, values);
    const totalVehi = await client.query(totalVehiculo, values);

    const agrupado = {};
    result.rows.forEach((row) => {
      const { tipo, marca, cantidad } = row;
      if (!agrupado[marca]) {
        agrupado[marca] = [];
      }
      agrupado[marca].push({
        tipo,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([marca, datos]) => ({
      marca,
      datos,
    }));
    await client.query("COMMIT");
    return res
      .status(200)
      .json({ expedientes: respuesta, total: totalVehi.rows });
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

    let totalSector = `SELECT COUNT(*) FROM infracciones infra
                          JOIN expedientes expe ON expe.id_expediente=infra.id_expediente
                          WHERE infra.sector_infraccion IS NOT NULL ${whereClause}`;

    let sectorResumen = `SELECT infra.sector_infraccion AS sector, 
                          funci.funcionario AS inspect,
                          expe.tipo_procedimiento AS proceso,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM infracciones infra
                          JOIN expedientes expe ON expe.id_expediente=infra.id_expediente
                          JOIN funcionarios funci ON expe.id_inspector=funci.id_funcionario
                          WHERE infra.sector_infraccion IS NOT NULL ${whereClause}
                          GROUP BY ROLLUP (infra.sector_infraccion, funci.funcionario,expe.tipo_procedimiento )
                          HAVING NOT (expe.tipo_procedimiento IS NULL)
                          ORDER BY sector NULLS LAST`;

    const result = await client.query(sectorResumen, values);
    const resultTotal = await client.query(totalSector, values);
    const agrupado = {};
    result.rows.forEach((row) => {
      const { sector, inspect, proceso, cantidad } = row;
      if (!agrupado[sector]) {
        agrupado[sector] = [];
      }
      agrupado[sector].push({
        inspect,
        proceso,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([sector, datos]) => ({
      sector,
      datos,
    }));
    await client.query("COMMIT");
    return res
      .status(200)
      .json({ expedientes: respuesta, total: resultTotal.rows });
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

    let totalGlosa = `SELECT COUNT(*) FROM expedientes expe
                        JOIN glosas_ley gl ON gl.id_glosa=expe.id_glosas
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
                        WHERE gl.glosa_ley IS NOT NULL ${whereClause}`;

    let glosaResumen = `SELECT  gl.glosa_ley AS glosa,
	                      expe.tipo_procedimiento AS proceso,
                          l.ley AS ley,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM expedientes expe
                        JOIN glosas_ley gl ON gl.id_glosa=expe.id_glosas
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
                        WHERE gl.glosa_ley IS NOT NULL ${whereClause}
                        GROUP BY ROLLUP (gl.glosa_ley,l.ley,expe.tipo_procedimiento )
						            HAVING NOT (l.ley IS NULL)
                        ORDER BY glosa NULLS LAST`;

    const result = await client.query(glosaResumen, values);
    const totalResult = await client.query(totalGlosa, values);

    const agrupado = {};
    result.rows.forEach((row) => {
      const { glosa, ley, proceso, cantidad } = row;
      if (!agrupado[glosa]) {
        agrupado[glosa] = [];
      }
      agrupado[glosa].push({
        ley,
        proceso,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([glosa, datos]) => ({
      glosa,
      datos,
    }));

    await client.query("COMMIT");
    return res
      .status(200)
      .json({ expedientes: respuesta, total: totalResult.rows });
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
      `expe.fecha_documento BETWEEN $${values.length + 1} AND $${
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
      `infra.juzgado IN (${jplArray
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
