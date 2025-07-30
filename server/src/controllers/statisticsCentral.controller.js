import { pool } from "../db.js";

const getEstadisticaCentral = async (req, res) => {
  const client = await pool.connect();
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");

    let informes =
      "SELECT \
            ic.*,\
            doi.* AS origen_informe,\
            dti.* AS tipo_informe,\
            dui.* AS ubicacion_informe,\
            dvi.* AS vehiculo_informe\
        FROM \
            informes_central ic\
         JOIN \
            datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
         JOIN \
            datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
         JOIN \
            datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
         JOIN \
            datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
            WHERE 1=1";
    const params = [];

    if (fechaInicio && fechaFin) {
      informes += ` AND doi.fecha_informe BETWEEN $${params.length + 1} AND $${
        params.length + 2
      }`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        informes += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        informes += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        informes += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        informes += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        informes += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        informes += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        informes += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        informes += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        informes += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte && Object.keys(tipoReporte).length > 0) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        informes += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }
    if (centralista) {
      informes += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }
    /*if (horario) {
      query += ` AND ic.horario = $${params.length + 1}`;
      params.push(horario);
    }*/
    //console.log("query", informes);
    //console.log("params:", params);
    const result = await client.query(informes, params);
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
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");
    let estadoResumen =
      "SELECT DISTINCT doi.estado_informe, dti.clasificacion_informe->>'label' as clasif,dti.tipo_informe->>'label' as tipo,\
      COUNT(doi.estado_informe) as cantidad\
        FROM informes_central ic\
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe\
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe\
        WHERE 1=1 AND doi.estado_informe IS NOT NULL";

    const params = [];

    if (fechaInicio && fechaFin) {
      estadoResumen += ` AND doi.fecha_informe BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        estadoResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        estadoResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        estadoResumen += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        estadoResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        estadoResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        estadoResumen += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        estadoResumen += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        estadoResumen += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        estadoResumen += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte && Object.keys(tipoReporte).length > 0) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        estadoResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }

    if (centralista) {
      estadoResumen += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }

    estadoResumen +=
      " GROUP BY doi.estado_informe, dti.clasificacion_informe->>'label',dti.tipo_informe->>'label'\
      ORDER BY doi.estado_informe ASC";
    const resultEstado = await client.query(estadoResumen, params);

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
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");
    let origenResumen =
      "SELECT DISTINCT doi.origen_informe->>'label' as origen, dti.clasificacion_informe->>'label' as clasif, doi.captura_informe,\
      COUNT(doi.origen_informe) as cantidad\
        FROM informes_central ic\
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe\
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe\
        WHERE 1=1 AND doi.origen_informe->>'label' IS NOT NULL";

    const params = [];

    if (fechaInicio && fechaFin) {
      origenResumen += ` AND doi.fecha_informe BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        origenResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        origenResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        origenResumen += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        origenResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        origenResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        origenResumen += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        origenResumen += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        origenResumen += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        origenResumen += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte && Object.keys(tipoReporte).length > 0) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        origenResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }
    if (centralista) {
      origenResumen += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }

    origenResumen +=
      " GROUP BY doi.origen_informe->>'label', dti.clasificacion_informe->>'label',doi.captura_informe\
      ORDER BY doi.origen_informe->>'label'";
    const resultOrigen = await client.query(origenResumen, params);
    await client.query("COMMIT");
    //console.log(origenResumen, parameter);

    return res.status(200).json({
      informe: resultOrigen.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servido" });
  }
};

const getResumenClasi = async (req, res) => {
  const client = await pool.connect();
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");
    let estadoEmergencia =
      "SELECT \
        dti.clasificacion_informe->>'label' AS clasificacion,\
        dti.tipo_informe->>'label' AS tipo,\
        COUNT(*) AS cantidad,\
        COUNT(dti.clasificacion_informe) AS total\
      FROM informes_central ic\
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes = ic.id_tipos_informe\
        JOIN datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
        JOIN datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
        JOIN datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
      WHERE dti.clasificacion_informe->>'label' IS NOT NULL";
    //WHERE dti.clasificacion_informe='Emergencia'
    const params = [];

    if (fechaInicio && fechaFin) {
      estadoEmergencia += ` AND doi.fecha_informe BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        estadoEmergencia += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        estadoEmergencia += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        estadoEmergencia += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        estadoEmergencia += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        estadoEmergencia += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        estadoEmergencia += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        estadoEmergencia += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        estadoEmergencia += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        estadoEmergencia += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte && Object.keys(tipoReporte).length > 0) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        estadoEmergencia += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }
    if (centralista && centralista.length > 0) {
      estadoEmergencia += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }

    estadoEmergencia +=
      " GROUP BY ROLLUP (clasificacion, tipo) \
      HAVING dti.clasificacion_informe->>'label' IS NOT NULL \
      ORDER BY clasificacion, tipo NULLS FIRST";

    const resultEmergencia = await client.query(estadoEmergencia, params);

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
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");
    let recursosResumen =
      "SELECT recurso->>'label' as recursos,COUNT(ic.id_informes_central) as cantidad\
    from informes_central ic\
    JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe\
    JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe,\
    LATERAL json_array_elements(dti.recursos_informe) AS recurso\
    WHERE 1=1 AND recurso->>'label' IS NOT NULL";

    const params = [];

    if (fechaInicio && fechaFin) {
      recursosResumen += ` AND doi.fecha_informe BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        recursosResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        recursosResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        recursosResumen += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        recursosResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        recursosResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        recursosResumen += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        recursosResumen += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        recursosResumen += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        recursosResumen += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        recursosResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }

    if (centralista) {
      recursosResumen += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }

    recursosResumen += " GROUP BY recurso->>'label' ORDER BY recurso->>'label'";
    console.log("query", recursosResumen);
    console.log("params:", params);

    const resultRecursos = await client.query(recursosResumen, params);
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
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");
    let rangoResumen =
      "SELECT doi.rango_horario, dti.clasificacion_informe->>'label' as clasif ,COUNT(ic.id_informes_central) as cantidad\
        FROM informes_central ic\
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe\
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe\
        WHERE 1=1 AND doi.rango_horario IS NOT NULL";

    const params = [];

    if (fechaInicio && fechaFin) {
      rangoResumen += ` AND doi.fecha_informe BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        rangoResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        rangoResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        rangoResumen += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        rangoResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        rangoResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        rangoResumen += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        rangoResumen += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        rangoResumen += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        rangoResumen += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        rangoResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }

    if (centralista) {
      rangoResumen += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }

    rangoResumen +=
      " GROUP BY doi.rango_horario, dti.clasificacion_informe->>'label'\
      ORDER BY doi.rango_horario";
    const resultRango = await client.query(rangoResumen, params);
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
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");
    let userResumen =
      "SELECT doi.user_creador,dti.tipo_informe->>'label' as tipo,doi.estado_informe,COUNT(doi.user_creador) as cantidad\
        FROM informes_central ic\
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe\
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe\
        WHERE user_creador IS NOT NULL";

    const params = [];

    if (fechaInicio && fechaFin) {
      userResumen += ` AND doi.fecha_informe BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        userResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        userResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        userResumen += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        userResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        userResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        userResumen += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        userResumen += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        userResumen += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        userResumen += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        userResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }

    if (centralista) {
      userResumen += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }

    userResumen +=
      " GROUP BY doi.user_creador,dti.tipo_informe->>'label',doi.estado_informe\
        ORDER BY doi.user_creador";
    const resultRango = await client.query(userResumen, params);
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

const getResumenVehi = async (req, res) => {
  const client = await pool.connect();
  let {
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
  } = req.query;
  try {
    await client.query("BEGIN");
    let vehiResumen =
      "SELECT\
        dti.clasificacion_informe->>'label' AS clasificacion,\
        elem->>'label' AS nombre_vehiculo,\
        COUNT(*) AS veces_que_aparece\
      FROM informes_central ic\
      JOIN datos_tipos_informes dti ON dti.id_tipos_informes = ic.id_tipos_informe\
      JOIN datos_vehiculos_informe dvi ON dvi.id_vehiculos = ic.id_vehiculo_informe\
      JOIN datos_origen_informe doi ON doi.id_origen_informe = ic.id_origen_informe\
      JOIN datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
      JOIN LATERAL jsonb_array_elements(dvi.vehiculos_informe::jsonb) AS elem ON TRUE\
      WHERE elem->>'label' IS NOT NULL";

    const params = [];

    if (fechaInicio && fechaFin) {
      vehiResumen += ` AND doi.fecha_informe BETWEEN $${
        params.length + 1
      } AND $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    if (estado && estado.length > 0) {
      if (Array.isArray(estado)) {
        // Si estado ya es un array, úsalo directamente
        const estadosArray = estado;

        vehiResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      } else if (typeof estado === "string") {
        // Si estado es una cadena (string), conviértelo en array
        const estadosArray = estado.split(",");

        vehiResumen += ` AND doi.estado_informe IN (${estadosArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...estadosArray);
      }
    }

    if (clasificacion?.length > 0) {
      if (clasificacion === "[]") {
        clasificacion = null;
      } else {
        vehiResumen += ` AND dti.clasificacion_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(clasificacion);
      }
    }

    if (captura && captura.length > 0) {
      if (Array.isArray(captura)) {
        const capturaArray = captura;

        vehiResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;

        params.push(...capturaArray);
      } else if (typeof captura === "string") {
        const capturaArray = captura.split(",");

        vehiResumen += ` AND doi.captura_informe IN (${capturaArray
          .map((_, index) => `$${params.length + index + 1}`)
          .join(", ")})`;
        params.push(...capturaArray);
      }
    }

    if (origen && Object.keys(origen).length > 0) {
      if (origen === "[]") {
        origen = null;
      } else {
        vehiResumen += ` AND doi.origen_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(origen);
      }
    }

    if (recursos && Object.keys(recursos).length > 0) {
      if (recursos === "[]") {
        recursos = null;
      } else {
        vehiResumen += ` AND dti.recursos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(recursos);
      }
    }

    if (sector && Object.keys(sector).length > 0) {
      if (sector === "[]") {
        sector = null;
      } else {
        vehiResumen += ` AND dui.sector_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(sector);
      }
    }

    if (vehiculo && Object.keys(vehiculo).length > 0) {
      if (vehiculo === "[]") {
        vehiculo = null;
      } else {
        vehiResumen += ` AND dvi.vehiculos_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(vehiculo);
      }
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        vehiResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }

    if (centralista) {
      vehiResumen += ` AND doi.user_creador = $${params.length + 1}`;
      params.push(centralista);
    }

    vehiResumen +=
      " GROUP BY dti.clasificacion_informe->>'label',elem->>'label'\
        ORDER BY veces_que_aparece DESC";
    const resultRango = await client.query(vehiResumen, params);
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
