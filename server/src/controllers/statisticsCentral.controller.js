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
    let estadoResumen = `SELECT DISTINCT doi.estado_informe,
     dti.clasificacion_informe->>'label' as clasif,dti.tipo_informe->>'label' as tipo,
      COUNT(doi.estado_informe) as cantidad
        FROM informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        WHERE 1=1 AND doi.estado_informe IS NOT NULL ${whereClause}
        GROUP BY doi.estado_informe, dti.clasificacion_informe->>'label',dti.tipo_informe->>'label'
        ORDER BY doi.estado_informe ASC`;

    const resultEstado = await client.query(estadoResumen, values);

    await client.query("COMMIT");
    //console.log(estadoResumen, parameter);

    return res.status(200).json({
      informe: resultEstado.rows,
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
        WHERE 1=1 ${whereClause}`;

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
    let recursosResumen = `SELECT recurso->>'label' as recursos,COUNT(ic.id_informes_central) as cantidad
        from informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe,
        LATERAL json_array_elements(dti.recursos_informe) AS recurso
        WHERE 1=1 AND recurso->>'label' IS NOT NULL ${whereClause}
        GROUP BY recurso->>'label' ORDER BY recurso->>'label'`;

    const resultRecursos = await client.query(recursosResumen, values);
    await client.query("COMMIT");

    //console.log(recursosResumen, parameter);
    return res.status(200).json({ informe: resultRecursos.rows });
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
    let rangoResumen = `SELECT doi.rango_horario, dti.clasificacion_informe->>'label' as clasif ,COUNT(ic.id_informes_central) as cantidad
        FROM informes_central ic
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        WHERE 1=1 AND doi.rango_horario IS NOT NULL ${whereClause}
        GROUP BY doi.rango_horario, dti.clasificacion_informe->>'label'\
        ORDER BY doi.rango_horario`;

    const resultRango = await client.query(rangoResumen, values);
    await client.query("COMMIT");
    //console.log(rangoResumen, parameter);

    return res.status(200).json({
      informe: resultRango.rows,
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
    let userResumen = `SELECT doi.user_creador,dti.tipo_informe->>'label' as tipo,doi.estado_informe,COUNT(doi.user_creador) as cantidad
        FROM informes_central ic
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe
        WHERE user_creador IS NOT NULL ${whereClause}
        GROUP BY doi.user_creador,dti.tipo_informe->>'label',doi.estado_informe
        ORDER BY doi.user_creador`;

    const resultRango = await client.query(userResumen, values);
    await client.query("COMMIT");

    return res.status(200).json({
      informe: resultRango.rows,
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
    let vehiResumen = `SELECT
        dti.clasificacion_informe->>'label' AS clasificacion,
        elem->>'label' AS nombre_vehiculo,
        COUNT(*) AS veces_que_aparece
      FROM informes_central ic
      JOIN datos_tipos_informes dti ON dti.id_tipos_informes = ic.id_tipos_informe
      JOIN datos_vehiculos_informe dvi ON dvi.id_vehiculos = ic.id_vehiculo_informe
      JOIN datos_origen_informe doi ON doi.id_origen_informe = ic.id_origen_informe
      JOIN datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion
      JOIN LATERAL jsonb_array_elements(dvi.vehiculos_informe::jsonb) AS elem ON TRUE
      WHERE elem->>'label' IS NOT NULL ${whereClause}
      GROUP BY dti.clasificacion_informe->>'label',elem->>'label'\
      ORDER BY veces_que_aparece DESC`;

    const resultRango = await client.query(vehiResumen, values);
    await client.query("COMMIT");

    return res.status(200).json({
      informe: resultRango.rows,
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
