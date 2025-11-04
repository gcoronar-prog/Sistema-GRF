import { pool } from "../db.js";

const getEstadisticaCentral = async (req, res) => {
  const client = await pool.connect();

  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");

    let informes = `SELECT 
            ic.*,
            doi.* AS origen_informe,
            dti.* AS tipo_informe,
            dui.* AS ubicacion_informe,
            dvi.* AS vehiculo_informe
        FROM 
            informes_central ic
         JOIN 
            datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe
         JOIN 
            datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes
         JOIN 
            datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion
         JOIN 
            datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos
            WHERE 1=1 ${whereClause}`;

    const result = await client.query(informes, values);
    await client.query("COMMIT");
    //console.log(result.rows);
    return res.status(200).json({
      informe: result.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

const getResumenEstado = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");

    let totalEstado = `SELECT COUNT(*) FROM informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        WHERE doi.estado_informe IS NOT NULL ${whereClause}`;

    let estadoResumen = `SELECT  doi.estado_informe AS estado,
    dti.tipo_informe->>'label' as tipo,
    dti.clasificacion_informe->>'label' as clasif,
                        COUNT(doi.estado_informe) as cantidad
                        FROM informes_central ic
                        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
                        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
                        WHERE doi.estado_informe IS NOT NULL ${whereClause}
                         GROUP BY ROLLUP (doi.estado_informe, clasif,tipo)
						            HAVING NOT (doi.estado_informe IS NULL)
                        ORDER BY estado NULLS LAST`;

    const resultEstado = await client.query(estadoResumen, values);
    const totalResult = await client.query(totalEstado, values);

    const agrupado = {};
    resultEstado.rows.forEach((row) => {
      const { estado, clasif, tipo, cantidad } = row;
      if (!agrupado[estado]) {
        agrupado[estado] = [];
      }
      agrupado[estado].push({
        tipo,
        clasif,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([estado, datos]) => ({
      estado,
      datos,
    }));

    await client.query("COMMIT");
    //console.log(estadoResumen, parameter);

    return res.status(200).json({
      informe: respuesta,
      total: totalResult.rows,
    });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return res.status(500).json({ msg: "Error de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getResumenOrigen = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let totalOrigen = `SELECT COUNT(*) FROM informes_central ic 
          JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
          JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        ${whereClause}`;

    let origenResumen = `SELECT 
      CASE 
          WHEN doi.origen_informe->>'label' IS NULL AND
        dti.clasificacion_informe->>'label' IS NULL AND 
        doi.captura_informe IS NULL THEN 'TOTAL GENERAL'
          WHEN doi.origen_informe->>'label' IS NULL THEN 'Total origen'
          ELSE doi.origen_informe->>'label'
        END AS origen,
      CASE
          WHEN dti.clasificacion_informe->>'label' IS NULL AND doi.origen_informe->>'label' IS NOT NULL THEN 'Total clasif'
          ELSE dti.clasificacion_informe->>'label'
        END AS clasif,
      CASE 
        WHEN doi.captura_informe IS NULL AND dti.clasificacion_informe->>'label' IS NOT NULL THEN 'Total captura'
        ELSE doi.captura_informe
      END AS captura,
        COUNT(doi.origen_informe) as cantidad
            FROM informes_central ic
            JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
            JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
            WHERE doi.origen_informe->>'label' IS NOT NULL ${whereClause}
            GROUP BY ROLLUP (doi.origen_informe->>'label' ,dti.clasificacion_informe->>'label',doi.captura_informe)
            HAVING doi.origen_informe->>'label' IS NOT NULL
            ORDER BY origen,clasif NULLS LAST`;

    const resultOrigen = await client.query(origenResumen, values);
    const resultTotalOrigen = await client.query(totalOrigen, values);

    const agrupado = {};
    resultOrigen.rows.forEach((row) => {
      const { clasif, origen, cantidad, captura } = row;
      if (!agrupado[origen]) {
        agrupado[origen] = [];
      }

      agrupado[origen].push({
        clasif,
        captura,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([origen, datos]) => ({
      origen,
      datos,
    }));

    await client.query("COMMIT");
    //console.log(origenResumen, parameter);

    return res.status(200).json({
      informe: respuesta,
      total: resultTotalOrigen.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servido" });
  }
};

const getResumenClasi = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let estadoEmergencia = `SELECT 
        dti.clasificacion_informe->>'label' AS clasificacion,
        dti.tipo_informe->>'label' AS tipo,
        COUNT(*) AS cantidad,
        COUNT(dti.clasificacion_informe) AS total
      FROM informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes = ic.id_tipos_informe
        JOIN datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe
        JOIN datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion
        JOIN datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos
        WHERE dti.clasificacion_informe->>'label' IS NOT NULL ${whereClause} 
        GROUP BY ROLLUP (clasificacion, tipo) 
        HAVING dti.clasificacion_informe->>'label' IS NOT NULL 
        ORDER BY clasificacion, tipo NULLS FIRST`;

    let totalClasificacion = `SELECT COUNT(*) FROM informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes = ic.id_tipos_informe
        JOIN datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe
        JOIN datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion
        JOIN datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos 
        WHERE 1=1 ${whereClause}`;
    const resultEmergencia = await client.query(estadoEmergencia, values);

    const totalClasi = await client.query(totalClasificacion, values);

    const agrupado = {};
    resultEmergencia.rows.forEach((row) => {
      const { clasificacion, tipo, cantidad } = row;
      if (!agrupado[clasificacion]) {
        agrupado[clasificacion] = [];
      }

      agrupado[clasificacion].push({
        tipo,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(
      ([clasificacion, tipos]) => ({
        clasificacion,
        tipos,
      })
    );

    await client.query("COMMIT");

    return res.status(200).json({
      informe: respuesta,
      total: totalClasi.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

const getResumenRecursos = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");

    let totalRecursos = `SELECT COUNT(*) from informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe,
        LATERAL json_array_elements(dti.recursos_informe) AS recurso
        WHERE recurso->>'label' IS NOT NULL ${whereClause}`;

    let recursosResumen = `SELECT recurso->>'label' as recursos,COUNT(ic.id_informes_central) as cantidad
        from informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe,
        LATERAL json_array_elements(dti.recursos_informe) AS recurso
        WHERE 1=1 AND recurso->>'label' IS NOT NULL ${whereClause}
        GROUP BY recurso->>'label' ORDER BY recurso->>'label'`;

    const resultRecursos = await client.query(recursosResumen, values);
    const totalResult = await client.query(totalRecursos, values);

    await client.query("COMMIT");

    //console.log(recursosResumen, parameter);
    return res
      .status(200)
      .json({ informe: resultRecursos.rows, total: totalResult.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servidor" });
  }
};

const getResumenRango = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");

    let totalRango = `SELECT COUNT(*) FROM informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        WHERE doi.rango_horario IS NOT NULL ${whereClause}`;

    let rangoResumen = `SELECT doi.rango_horario AS rangos, 
    dti.clasificacion_informe->>'label' as clasif 
    ,COUNT(ic.id_informes_central) as cantidad
        FROM informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        WHERE 1=1 AND doi.rango_horario IS NOT NULL ${whereClause}
        GROUP BY ROLLUP (doi.rango_horario, dti.clasificacion_informe->>'label')
        HAVING NOT (doi.rango_horario IS NULL)
        ORDER BY rangos NULLS LAST`;

    const resultRango = await client.query(rangoResumen, values);
    const totalResult = await client.query(totalRango, values);

    const agrupado = {};
    resultRango.rows.forEach((row) => {
      const { rangos, clasif, cantidad } = row;
      if (!agrupado[rangos]) {
        agrupado[rangos] = [];
      }

      agrupado[rangos].push({
        clasif,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([horario, datos]) => ({
      horario,
      datos,
    }));

    await client.query("COMMIT");
    //console.log(rangoResumen, parameter);

    return res.status(200).json({
      informe: respuesta,
      total: totalResult.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servido" });
  }
};

const getResumenUser = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);

  try {
    await client.query("BEGIN");

    let totalUser = `SELECT COUNT(*) FROM informes_central ic
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        WHERE user_creador IS NOT NULL ${whereClause}`;

    let userResumen = `SELECT doi.user_creador AS users,
        dti.tipo_informe->>'label' as tipo,
        COUNT(doi.user_creador) as cantidad
        FROM informes_central ic
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        WHERE user_creador IS NOT NULL ${whereClause}
        GROUP BY ROLLUP (doi.user_creador,dti.tipo_informe->>'label')
        HAVING NOT (doi.user_creador IS NULL)
        ORDER BY users NULLS LAST`;

    const resultUser = await client.query(userResumen, values);
    const totalResult = await client.query(totalUser, values);

    const agrupado = {};
    resultUser.rows.forEach((row) => {
      const { users, tipo, cantidad } = row;
      if (!agrupado[users]) {
        agrupado[users] = [];
      }

      agrupado[users].push({
        tipo,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(([users, datos]) => ({
      users,
      datos,
    }));

    await client.query("COMMIT");

    return res.status(200).json({
      informe: respuesta,
      total: totalResult.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servido" });
  }
};

const getResumenVehi = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");

    let totalVehi = `SELECT COUNT(*) FROM informes_central ic
      JOIN datos_tipos_informes dti ON dti.id_tipos_informes = ic.id_tipos_informe
      JOIN datos_vehiculos_informe dvi ON dvi.id_vehiculos = ic.id_vehiculo_informe
      JOIN datos_origen_informe doi ON doi.id_origen_informe = ic.id_origen_informe
      JOIN datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion
      JOIN LATERAL jsonb_array_elements(dvi.vehiculos_informe::jsonb) AS elem ON TRUE
      WHERE elem->>'label' IS NOT NULL ${whereClause}`;

    let vehiResumen = `SELECT
        elem->>'label' AS nombre_vehiculo,
        dti.clasificacion_informe->>'label' AS clasificacion,
        COUNT(*) AS cantidad
      FROM informes_central ic
      JOIN datos_tipos_informes dti ON dti.id_tipos_informes = ic.id_tipos_informe
      JOIN datos_vehiculos_informe dvi ON dvi.id_vehiculos = ic.id_vehiculo_informe
      JOIN datos_origen_informe doi ON doi.id_origen_informe = ic.id_origen_informe
      JOIN datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion
      JOIN LATERAL jsonb_array_elements(dvi.vehiculos_informe::jsonb) AS elem ON TRUE
      ${whereClause}
      GROUP BY ROLLUP (elem->>'label',dti.clasificacion_informe->>'label')
	  HAVING NOT (elem->>'label' IS NULL)
      ORDER BY nombre_vehiculo NULLS LAST`;

    const result = await client.query(vehiResumen, values);
    const totalResult = await client.query(totalVehi, values);

    const agrupado = {};
    result.rows.forEach((row) => {
      const { nombre_vehiculo, clasificacion, cantidad } = row;
      if (!agrupado[nombre_vehiculo]) {
        agrupado[nombre_vehiculo] = [];
      }

      agrupado[nombre_vehiculo].push({
        clasificacion,
        cantidad: parseInt(cantidad),
      });
    });

    const respuesta = Object.entries(agrupado).map(
      ([nombre_vehiculo, datos]) => ({
        nombre_vehiculo,
        datos,
      })
    );

    await client.query("COMMIT");

    return res.status(200).json({
      informe: respuesta,
      total: totalResult.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servido" });
  }
};

function buildWhereClause({
  fechaInicio,
  fechaFin,
  estado,
  clasificacion,
  captura,
  origen,
  recursos,
  sector,
  vehiculo,
  centralista,
  tipoReporte,
}) {
  const conditions = [];
  const values = [];

  const addCondition = (cond, ...vals) => {
    conditions.push(cond);
    values.push(...vals);
  };

  if (fechaInicio && fechaFin) {
    addCondition(
      `doi.fecha_informe BETWEEN $${values.length + 1} AND $${
        values.length + 2
      }`,
      fechaInicio,
      fechaFin
    );
  }

  if (estado && estado.length > 0) {
    const estadosArray = Array.isArray(estado) ? estado : estado.split(",");
    addCondition(
      `doi.estado_informe IN (${estadosArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...estadosArray
    );
  }

  if (clasificacion && clasificacion !== "[]") {
    addCondition(
      `dti.clasificacion_informe::jsonb @> $${values.length + 1}::jsonb`,
      clasificacion
    );
  }

  if (captura && captura.length > 0) {
    const capturaArray = Array.isArray(captura) ? captura : captura.split(",");
    addCondition(
      `doi.captura_informe IN (${capturaArray
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ")})`,
      ...capturaArray
    );
  }

  if (origen && origen !== "[]") {
    addCondition(
      `doi.origen_informe::jsonb @> $${values.length + 1}::jsonb`,
      origen
    );
  }

  if (recursos && recursos !== "[]") {
    addCondition(
      `dti.recursos_informe::jsonb @> $${values.length + 1}::jsonb`,
      recursos
    );
  }

  if (sector && sector !== "[]") {
    addCondition(
      `dui.sector_informe::jsonb @> $${values.length + 1}::jsonb`,
      sector
    );
  }

  if (vehiculo && vehiculo !== "[]") {
    addCondition(
      `dvi.vehiculos_informe::jsonb @> $${values.length + 1}::jsonb`,
      vehiculo
    );
  }

  if (tipoReporte && tipoReporte !== "[]") {
    addCondition(
      `dti.tipo_informe::jsonb @> $${values.length + 1}::jsonb`,
      tipoReporte
    );
  }

  if (centralista) {
    addCondition(`doi.user_creador = $${values.length + 1}`, centralista);
  }

  return {
    whereClause: conditions.length ? " AND " + conditions.join(" AND ") : "",
    values,
  };
}

export {
  getResumenClasi,
  getEstadisticaCentral,
  getResumenEstado,
  getResumenOrigen,
  getResumenRecursos,
  getResumenRango,
  getResumenUser,
  getResumenVehi,
};
