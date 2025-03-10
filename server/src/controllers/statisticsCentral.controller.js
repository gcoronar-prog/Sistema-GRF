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
  } = req.body;
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

    if (estado) {
      /*informes += ` AND doi.estado_informe IN $${params.length + 1}`;
      params.push(estado);*/
      const estadosArray = estado.split(",");
      if (estadosArray.length > 0) {
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
        informes += ` AND doi.clasificacion_informe = $${params.length + 1}`;
        params.push(clasificacion);
      }
    }

    if (captura) {
      const capturaArray = captura.split(",");
      if (capturaArray.length > 0) {
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
      }
      params.push(origen);
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
        informes += ` AND dti.tipo_informe::jsonb = $${
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
  let { fechaInicio, fechaFin } = req.body;
  try {
    await client.query("BEGIN");
    let estadoEmergencia =
      "SELECT dti.tipo_informe::TEXT,COUNT(dti.clasificacion_informe)\
        FROM informes_central ic\
        JOIN datos_tipos_informes dti ON dti.id_tipos_informes=ic.id_tipos_informe\
        JOIN datos_origen_informe doi ON doi.id_origen_informe=ic.id_origen_informe\
        WHERE dti.clasificacion_informe='Emergencia'\
       ";

    const parameter = [];

    if (fechaInicio && fechaFin) {
      estadoEmergencia += ` AND doi.fecha_informe BETWEEN $${
        parameter.length + 1
      } AND $${parameter.length + 2} `;
      parameter.push(fechaInicio, fechaFin);
    }

    estadoEmergencia += "GROUP BY dti.tipo_informe::TEXT";

    const resultEmergencia = await client.query(estadoEmergencia, parameter);

    console.log(estadoEmergencia, parameter);
    await client.query("COMMIT");
    console.log("query", estadoEmergencia);
    console.log("params:", parameter);
    console.log("resultado", resultEmergencia.rows);
    res.status(200).json({
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

const getResumenOrigen = async (req, res) => {
  const client = await pool.connect();
  let { fechaInicio, fechaFin } = req.body;
  try {
    await client.query("BEGIN");
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servido" });
  }
};
export { getEstadisticaCentral, getResumenEstado };
