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
        WHERE 1=1";

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
        WHERE 1=1";

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

    origenResumen +=
      " GROUP BY doi.origen_informe->>'label', dti.clasificacion_informe->>'label',doi.captura_informe";
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
      "SELECT  dti.clasificacion_informe->>'label' as clasif, dti.tipo_informe->>'label' as tipo, \
      COUNT(dti.clasificacion_informe) as cantidad\
        FROM informes_central ic\
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe\
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe\
       ";
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

    estadoEmergencia +=
      " GROUP BY dti.clasificacion_informe->>'label', dti.tipo_informe->>'label'";

    const resultEmergencia = await client.query(estadoEmergencia, params);

    //console.log(estadoEmergencia, parameter);
    await client.query("COMMIT");
    //console.log("query", estadoEmergencia);
    //console.log("params:", parameter);
    //console.log("resultado", resultEmergencia.rows);
    return res.status(200).json({
      informe: resultEmergencia.rows,
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
    WHERE 1=1";

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

    if (tipoReporte && Object.keys(tipoReporte).length > 0) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        recursosResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }

    recursosResumen += " GROUP BY recurso->>'label'";
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
        WHERE 1=1";

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

    if (tipoReporte && Object.keys(tipoReporte).length > 0) {
      if (tipoReporte === "[]") {
        tipoReporte = null;
      } else {
        rangoResumen += ` AND dti.tipo_informe::jsonb @> $${
          params.length + 1
        }::jsonb`;
        params.push(tipoReporte);
      }
    }

    rangoResumen +=
      " GROUP BY doi.rango_horario, dti.clasificacion_informe->>'label'";
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

export {
  getResumenClasi,
  getEstadisticaCentral,
  getResumenEstado,
  getResumenOrigen,
  getResumenRecursos,
  getResumenRango,
};
