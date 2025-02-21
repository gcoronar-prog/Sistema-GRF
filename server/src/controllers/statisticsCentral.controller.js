import { pool } from "../db.js";

const filters = {
  fechaInicio: "",
  fechaFin: "",
  estado: "",
  clasificacion: "",
  caputra: "",
  origen: "",
  recursos: "",
  sector: "",
  vehiculo: "",
  centralista: "",
  tipoReporte: "",
  horario: "",
};

const getEstadisticaCentral = async (req, res) => {
  const client = await pool.connect();
  const {
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
      informes += ` AND doi.estado_informe = $${params.length + 1}`;
      params.push(estado);
    }

    if (clasificacion?.length > 0) {
      informes += ` AND doi.clasificacion_informe = $${params.length + 1}`;
      params.push(clasificacion);
    }

    if (captura) {
      informes += ` AND doi.captura_informe = $${params.length + 1}`;
      params.push(captura);
    }

    if (origen?.length > 0) {
      informes += ` AND doi.origen_informe IN (${origen
        .map((_, i) => `$${params.length + i + 1}`)
        .join(",")})`;
      // ` AND doi.origen_informe = $${params.length + 1}`;
      params.push(origen);
    }

    if (recursos) {
      informes += ` AND dti.recursos_informe = $${params.length + 1}`;
      params.push(recursos);
    }

    if (sector?.length > 0) {
      informes += ` AND dui.sector_informe IN (${sector
        .map((_, i) => `$${params.length + i + 1}`)
        .join(",")})`;
      params.push(...sector);
    }

    if (vehiculo?.length > 0) {
      informes += ` AND dvi.id_vehiculos IN (${vehiculo
        .map((_, i) => `$${params.length + i + 1}`)
        .join(",")})`;
      params.push(...vehiculo);
    }

    /*if (centralista) {
      query += ` AND ic.centralista = $${params.length + 1}`;
      params.push(centralista);
    }*/

    if (tipoReporte) {
      informes += ` AND dti.tipo_informe IN (${tipoReporte
        .map((_, i) => `$${params.length + i + 1}`)
        .join(",")})`;
      params.push(...tipoReporte);
    }

    /*if (horario) {
      query += ` AND ic.horario = $${params.length + 1}`;
      params.push(horario);
    }*/

    console.log(informes, params);
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

export { getEstadisticaCentral };
