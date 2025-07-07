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
      estadoInspeccion += ` AND infra.fecha_resolucion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
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

const getLeyesInsp = async (req, res) => {
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
    let leyesResumen = `SELECT DISTINCT l.ley,
                          expe.tipo_procedimiento,
                          infra.juzgado,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM expedientes expe
                        JOIN infracciones infra
                        ON infra.id_expediente=expe.id_expediente
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        WHERE 1=1`;

    const params = [];
    if (fechaInicioInfrac && fechaFinInfrac) {
      leyesResumen += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      leyesResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      leyesResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        leyesResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        leyesResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        leyesResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        leyesResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        leyesResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        leyesResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      leyesResumen += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      leyesResumen += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      leyesResumen += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      leyesResumen += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      leyesResumen += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      leyesResumen += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    leyesResumen += ` GROUP BY l.ley,expe.tipo_procedimiento,infra.juzgado
                      ORDER BY l.ley`;

    const result = await client.query(leyesResumen, params);
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
    let inspectResumen = `SELECT DISTINCT  
		func.funcionario,
		expe.tipo_procedimiento,
		COUNT(expe.id_expediente) AS cantidad
	FROM expedientes expe 
	JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
	JOIN funcionarios func on expe.id_inspector=func.id_funcionario
	WHERE 1=1`;

    const params = [];
    if (fechaInicioInfrac && fechaFinInfrac) {
      inspectResumen += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      inspectResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      inspectResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        inspectResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        inspectResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        inspectResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        inspectResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        inspectResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        inspectResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      inspectResumen += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      inspectResumen += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      inspectResumen += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      inspectResumen += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      inspectResumen += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      inspectResumen += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    inspectResumen += ` GROUP BY expe.id_inspector,expe.tipo_procedimiento,func.funcionario
ORDER BY func.funcionario`;

    const result = await client.query(inspectResumen, params);
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
    let vehiResumen = `SELECT DISTINCT vehi.tipo_vehi,
                            vehi.marca_vehi,
                            COUNT(vehi.id_vehiculos) AS cantidad
                          FROM vehiculos_contri vehi
                            JOIN expedientes expe ON expe.id_expediente=vehi.id_expediente
                            JOIN infracciones infra ON expe.id_expediente=infra.id_expediente                      
                        WHERE 1=1`;

    const params = [];
    if (fechaInicioInfrac && fechaFinInfrac) {
      vehiResumen += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      vehiResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      vehiResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        vehiResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        vehiResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        vehiResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        vehiResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        vehiResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        vehiResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      vehiResumen += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      vehiResumen += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      vehiResumen += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      vehiResumen += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      vehiResumen += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      vehiResumen += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    vehiResumen += ` GROUP BY vehi.tipo_vehi,vehi.marca_vehi 
                          ORDER BY vehi.tipo_vehi`;

    const result = await client.query(vehiResumen, params);
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
    let sectorResumen = `SELECT infra.sector_infraccion, 
                          expe.id_inspector,
                          expe.tipo_procedimiento,
                          COUNT(expe.id_expediente) as cantidad
                          FROM infracciones infra
                          JOIN expedientes expe ON expe.id_expediente=infra.id_expediente
                          WHERE infra.sector_infraccion IS NOT NULL
                        `;

    const params = [];
    if (fechaInicioInfrac && fechaFinInfrac) {
      sectorResumen += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      sectorResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      sectorResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        sectorResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        sectorResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        sectorResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        sectorResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        sectorResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        sectorResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      sectorResumen += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      sectorResumen += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      sectorResumen += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      sectorResumen += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      sectorResumen += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      sectorResumen += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    sectorResumen += ` GROUP BY infra.sector_infraccion, expe.id_inspector,expe.tipo_procedimiento 
                          ORDER BY infra.sector_infraccion`;

    const result = await client.query(sectorResumen, params);
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
    let glosaResumen = `SELECT expe.tipo_procedimiento,
                          gl.glosa_ley,
                          l.ley,
                          COUNT(expe.id_expediente) AS cantidad
                          FROM expedientes expe
                        JOIN glosas_ley gl ON gl.id_glosa=expe.id_glosas
                        JOIN leyes l ON l.id_ley=expe.id_leyes
                        JOIN infracciones infra ON infra.id_expediente=expe.id_expediente
                        WHERE gl.glosa_ley IS NOT NULL
                        `;

    const params = [];
    if (fechaInicioInfrac && fechaFinInfrac) {
      glosaResumen += ` AND infra.fecha_infraccion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      glosaResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    // fecha de creacion del expediente. Se agrega automaticamente desde un trigger.
    if (fechaInicio && fechaFin) {
      glosaResumen += ` AND infra.fecha_citacion BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicioInfrac, fechaFinInfrac);
    }

    if (estado_exp && estado_exp.length > 0) {
      if (Array.isArray(estado_exp)) {
        const estadosArray = estado_exp;

        glosaResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...estadosArray);
      } else if (typeof estado_exp === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado_exp.split(",");

        glosaResumen += ` AND expe.estado_exp IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (tipo_proce && tipo_proce.length > 0) {
      if (Array.isArray(tipo_proce)) {
        const procesoArray = tipo_proce;

        glosaResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...procesoArray);
      } else if (typeof tipo_proce === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const procesoArray = tipo_proce.split(",");

        glosaResumen += ` AND expe.tipo_procedimiento IN (${procesoArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...procesoArray);
      }
    }

    if (jpl && jpl.length > 0) {
      if (Array.isArray(jpl)) {
        const jplArray = jpl;

        glosaResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...jplArray);
      } else if (typeof jpl === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const jplArray = jpl.split(",");

        glosaResumen += ` AND expe.tipo_procedimiento IN (${jplArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...jplArray);
      }
    }

    if (leyes && leyes.length > 0) {
      glosaResumen += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector.length > 0) {
      const cleanedInspector = inspector.replace(/"/g, "");
      glosaResumen += ` AND expe.id_inspector= $${params.length + 1}`;
      params.push(cleanedInspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      glosaResumen += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo.length > 0) {
      const cleanedTipo = tipo_vehiculo.replace(/"/g, "");
      glosaResumen += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(cleanedTipo);
    }

    if (marca_vehiculo && marca_vehiculo.length > 0) {
      const cleanedMarca = marca_vehiculo.replace(/"/g, "");
      glosaResumen += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(cleanedMarca);
    }

    if (sector_infrac && sector_infrac.length > 0) {
      const cleanedSector = sector_infrac.replace(/"/g, "");
      glosaResumen += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(cleanedSector);
    }

    glosaResumen += `  GROUP BY expe.tipo_procedimiento,gl.glosa_ley,l.ley 
                          ORDER BY expe.tipo_procedimiento`;

    const result = await client.query(glosaResumen, params);
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
