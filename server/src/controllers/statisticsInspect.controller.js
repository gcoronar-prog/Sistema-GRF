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

    if (leyes && leyes !== "[]") {
      expedientes += ` AND expe.id_leyes=$${params.length + 1}`;
      params.push(leyes);
    }

    if (inspector && inspector !== "[]") {
      expedientes += ` AND expe.inspector= $${params.length + 1}`;
      params.push(inspector);
    }

    if (rut_contri && rut_contri.length > 0) {
      expedientes += ` AND contri.rut_contri = $${params.length + 1}`;
      params.push(rut_contri);
    }

    if (tipo_vehiculo && tipo_vehiculo !== "[]") {
      expedientes += ` AND vehi.tipo_vehi= $${params.length + 1}`;
      params.push(tipo_vehiculo);
    }

    if (marca_vehiculo && marca_vehiculo !== "[]") {
      expedientes += ` AND vehi.marca_vehi = $${params.length + 1}`;
      params.push(marca_vehiculo);
    }

    if (sector_infrac && sector_infrac !== "[]") {
      expedientes += ` AND infra.sector_infraccion= $${params.length + 1}`;
      params.push(sector_infrac);
    }

    const result = await client.query(expedientes, params);
    await client.query("COMMIT");
    console.log("expediente: ", result.rows);
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

export { getStatisticInspect };
