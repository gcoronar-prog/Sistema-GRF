import { pool } from "../db.js";

const getStatisticInspect = async (req, res) => {
  const client = await pool.connect();
  let {
    fechaInicioInfrac,
    fechaFinInfrac,
    fechaInicioCitacion,
    fechaFinCitacion,
    fechaInicio,
    fechaFin,

    estado_exp,
    tipo_proce,
    jpl,
    digitador,
    leyes,
    inspector,

    rut_contri,
    tipo_vehiculo,
    marca_vehiculo,
    sector_infrac,
  } = req.query;
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
        WHERE 1=1`;
    const params = [];

    if (fechaInicioInfrac && fechaFinInfrac) {
      expedientes += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      expedientes += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      expedientes += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        expedientes += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        expedientes += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        expedientes += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        expedientes += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        expedientes += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        expedientes += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      expedientes += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      expedientes += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      expedientes += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      expedientes += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      expedientes += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      expedientes += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    const result = await client.query(expedientes, params);
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
  let {
    fechaInicioInfrac,
    fechaFinInfrac,
    fechaInicioCitacion,
    fechaFinCitacion,
    fechaInicio,
    fechaFin,

    estado_exp,
    tipo_proce,
    jpl,
    digitador,
    leyes,
    inspector,

    rut_contri,
    tipo_vehiculo,
    marca_vehiculo,
    sector_infrac,
  } = req.query;
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
                            WHERE 1=1`;

    const params = [];
    if (fechaInicioInfrac && fechaFinInfrac) {
      estadoInspeccion += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      estadoInspeccion += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      estadoInspeccion += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        estadoInspeccion += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        estadoInspeccion += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        estadoInspeccion += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        estadoInspeccion += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        estadoInspeccion += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        estadoInspeccion += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      estadoInspeccion += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      estadoInspeccion += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      estadoInspeccion += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      estadoInspeccion += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      estadoInspeccion += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      estadoInspeccion += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    estadoInspeccion += ` GROUP BY estado_exp, tipo_procedimiento`;

    const result = await client.query(estadoInspeccion, params);

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
  let {
    fechaInicioInfrac,
    fechaFinInfrac,
    fechaInicioCitacion,
    fechaFinCitacion,
    fechaInicio,
    fechaFin,

    estado_exp,
    tipo_proce,
    jpl,
    digitador,
    leyes,
    inspector,

    rut_contri,
    tipo_vehiculo,
    marca_vehiculo,
    sector_infrac,
  } = req.query;

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
                            WHERE 1=1`;

    const params = [];
    if (fechaInicioInfrac && fechaFinInfrac) {
      tipoProceso += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      tipoProceso += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      tipoProceso += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        tipoProceso += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        tipoProceso += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        tipoProceso += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        tipoProceso += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        tipoProceso += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        tipoProceso += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      tipoProceso += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      tipoProceso += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      tipoProceso += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      tipoProceso += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      tipoProceso += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      tipoProceso += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    tipoProceso += ` GROUP BY funci.funcionario,tipo_procedimiento
                      ORDER BY tipo_procedimiento`;

    const result = await client.query(tipoProceso, params);
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

export { getStatisticInspect, getEstadoExpe, getTipoProce };
