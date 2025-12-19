import { pool } from "../db.js";

const getAlfa = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM informes_alfa");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen informes" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Problemas de conexión al servidor" });
  }
};

const getAllInformesALFA = async (req, res) => {
  const client = await pool.connect(); // Asegúrate de usar await
  try {
    await client.query("BEGIN");

    // Consultas en paralelo para mejorar rendimiento
    const [informes, danios, evaluacion, eventos, responsable] =
      await Promise.all([
        client.query("SELECT * FROM informes_alfa"),
        client.query("SELECT * FROM danios_alfa"),
        client.query("SELECT * FROM evaluacion_alfa"),
        client.query("SELECT * FROM eventos_alfa"),
        client.query("SELECT * FROM responsable_alfa"),
      ]);

    await client.query("COMMIT");

    // Respuesta con todos los datos
    return res.json({
      informes: informes.rows,
      danios: danios.rows,
      evaluacion: evaluacion.rows,
      eventos: eventos.rows,
      responsable: responsable.rows,
    });
  } catch (error) {
    console.error("Error al obtener informes ALFA:", error);

    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release(); // Liberar el cliente al final
  }
};

const getInformesALFA = async (req, res) => {
  const client = await pool.connect(); // Asegúrate de usar await
  const { id } = req.params;
  try {
    await client.query("BEGIN");

    const informeAlfa = await client.query(
      `SELECT * FROM informes_alfa ia
        JOIN danios_alfa da ON ia.id_danios=da.id_danios
        JOIN evaluacion_alfa ea ON ia.id_evaluacion=ea.id_evaluacion
        JOIN eventos_alfa eva ON ia.id_evento=eva.id_evento
        JOIN responsable_alfa ra ON ia.id_responsable=ra.id_responsable
        JOIN sectores_alfa sa ON ia.id_sector=sa.id_sector
        WHERE ia.id_alfa = $1`,
      [id]
    );

    await client.query("COMMIT");

    // Respuesta con todos los datos
    return res.status(200).json({
      informe_alfa: informeAlfa.rows,
    });
  } catch (error) {
    console.error("Error al obtener informes ALFA:", error);

    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release(); // Liberar el cliente al final
  }
};

const createAlfa = async (req, res) => {
  const client = await pool.connect();
  try {
    const data = req.body;

    await client.query("BEGIN");

    const { rows: informesALFA } = await client.query(
      "INSERT INTO informes_alfa(fuente,\
         fono, sismo_escala, tipo_evento, otro_evento,descripcion,\
          ocurrencia, acciones, oportunidad_tpo, recursos_involucrados,\
           evaluacion_necesidades,capacidad_respuesta,observaciones,\
           usuario_grd,fecha_hora,otras_necesidades) \
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *",
      [
        data.fuente,
        data.fono,
        data.sismo_escala,
        data.tipo_evento,
        data.otro_evento,
        data.descripcion,
        data.ocurrencia,
        data.acciones,
        data.oportunidad_tpo,
        data.recursos_involucrados,
        data.evaluacion_necesidades,
        data.capacidad_respuesta,
        data.observaciones,
        data.usuario_grd,
        data.fecha_hora,
        data.otras_necesidades,
      ]
    );
    const idAlfas = informesALFA[0].cod_alfa;

    const [damages, sectores] = await Promise.all([
      client.query(
        "INSERT INTO danios_y_montos (daños_vivienda, daños_infra,\
            daños_personas, monto_estimado,cod_alfa_daños)\
             VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [
          data.daños_vivienda,
          data.daños_infra,
          data.daños_personas,
          data.monto_estimado,
          idAlfas,
        ]
      ),

      client.query(
        "INSERT INTO sectores_alfa (region, provincia,comuna,direccion, tipo_ubicacion,cod_alfa_sector) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          data.region,
          data.provincia,
          data.comuna,
          data.direccion,
          data.tipo_ubicacion,
          idAlfas,
        ]
      ),
    ]);

    await client.query("COMMIT");

    return res.json({
      InformeAlfa: informesALFA[0],
      Daños: damages.rows[0],
      Sectores: sectores.rows[0],
    });
  } catch (error) {
    console.log(error);

    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problema de conexion con servidor" });
  } finally {
    client.release();
  }
};

const updateALFA = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const data = req.body;

    await client.query("BEGIN");

    const { rows: informesALFA } = await client.query(
      "UPDATE informes_alfa SET fuente=$1,\
         fono=$2, sismo_escala=$3, tipo_evento=$4, otro_evento=$5, descripcion=$6,\
          ocurrencia=$7, acciones=$8, oportunidad_tpo=$9, recursos_involucrados=$10,\
           evaluacion_necesidades=$11,capacidad_respuesta=$12,observaciones=$13,\
           usuario_grd=$14,fecha_hora=$15,otras_necesidades=$16 \
           WHERE cod_alfa=$17 RETURNING *",
      [
        data.fuente,
        data.fono,
        data.sismo_escala,
        data.tipo_evento,
        data.otro_evento,
        data.descripcion,
        data.ocurrencia,
        data.acciones,
        data.oportunidad_tpo,
        data.recursos_involucrados,
        data.evaluacion_necesidades,
        data.capacidad_respuesta,
        data.observaciones,
        data.usuario_grd,
        data.fecha_hora,
        data.otras_necesidades,
        id,
      ]
    );

    const [damages, sectores] = await Promise.all([
      client.query(
        "UPDATE danios_y_montos SET daños_vivienda=$1, daños_infra=$2,\
            daños_personas=$3, monto_estimado=$4 \
            WHERE cod_alfa_daños = $5 RETURNING *",
        [
          data.daños_vivienda,
          data.daños_infra,
          data.daños_personas,
          data.monto_estimado,
          id,
        ]
      ),

      client.query(
        "UPDATE sectores_alfa SET region=$1, provincia=$2,comuna=$3,direccion=$4, \
        tipo_ubicacion=$5 WHERE cod_alfa_sector=$6 RETURNING *",
        [
          data.region,
          data.provincia,
          data.comuna,
          data.direccion,
          data.tipo_ubicacion,
          id,
        ]
      ),
    ]);

    await client.query("COMMIT");

    return res.json({
      InformeAlfa: informesALFA[0],
      Daños: damages.rows[0],
      Sectores: sectores.rows[0],
    });
  } catch (error) {
    console.log(error);

    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problema de conexion con servidor" });
  } finally {
    client.release();
  }
};

const deleteAlfa = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const { rows: informesALFA } = await client.query(
      "DELETE FROM informes_alfa WHERE cod_alfa=$1 RETURNING *",
      [id]
    );

    const [damages, sectores] = await Promise.all([
      client.query(
        "DELETE FROM danios_y_montos WHERE cod_alfa_daños = $1 RETURNING *",
        [id]
      ),

      client.query(
        "DELETE FROM sectores_alfa WHERE cod_alfa_sector=$1 RETURNING *",
        [id]
      ),
    ]);

    await client.query("COMMIT");

    return res.json({
      InformeAlfa: informesALFA[0],
      Daños: damages.rows[0],
      Sectores: sectores.rows[0],
    });
  } catch (error) {
    console.log(error);

    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problema de conexion con servidor" });
  } finally {
    client.release();
  }
};

const getFuncionarioGRD = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM funcionarios WHERE rol_func='GRD'"
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No hay datos de funcionarios" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getLastAlfa = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const [informe, damages, sectores] = await Promise.all([
      client.query("SELECT * FROM informes_alfa ORDER BY id_alfa DESC LIMIT 1"),
      client.query(
        "SELECT * FROM danios_y_montos ORDER BY id_daños DESC LIMIT 1"
      ),
      client.query(
        "SELECT * FROM sectores_alfa ORDER BY id_sectores_alfa DESC LIMIT 1"
      ),
    ]);

    await client.query("COMMIT");

    return res.json({
      informe_Alfa: informe.rows[0],
      daños: damages.rows[0],
      sector: sectores.rows[0],
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getFirstAlfa = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const [informe, damages, sectores] = await Promise.all([
      client.query("SELECT * FROM informes_alfa ORDER BY id_alfa ASC LIMIT 1"),
      client.query(
        "SELECT * FROM danios_y_montos ORDER BY id_daños ASC LIMIT 1"
      ),
      client.query(
        "SELECT * FROM sectores_alfa ORDER BY id_sectores_alfa ASC LIMIT 1"
      ),
    ]);

    await client.query("COMMIT");

    return res.json({
      informe_Alfa: informe.rows[0],
      daños: damages.rows[0],
      sector: sectores.rows[0],
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getPrevAlfa = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // 1. Obtener el expediente previo
    const { rows: informesRows } = await client.query(
      "SELECT * FROM informes_alfa WHERE id_alfa < (SELECT id_alfa FROM informes_alfa WHERE cod_alfa = $1) ORDER BY id_alfa DESC LIMIT 1",
      [id]
    );

    if (informesRows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "No se encontró expediente previo" });
    }

    const informe = informesRows[0];

    const { rows: dañosRows } = await client.query(
      "SELECT * FROM danios_y_montos WHERE cod_alfa_daños=$1 ORDER BY id_daños DESC LIMIT 1",
      [id]
    );

    const { rows: sectorRows } = await client.query(
      "SELECT * FROM sectores_alfa WHERE cod_alfa_sector = $1 ORDER BY id_sectores_alfa DESC LIMIT 1",
      [id]
    );

    //contribuyente = contriRows.length > 0 ? contriRows[0] : null;

    await client.query("COMMIT");

    return res.json({
      informesRows,
      dañosRows,
      sectorRows,
    });
  } catch (error) {
    console.error("Error en getPrevAlfa:", error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getNextAlfa = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const { rows: informesRows } = await client.query(
      "SELECT * FROM informes_alfa WHERE id_alfa > (SELECT id_alfa FROM informes_alfa WHERE cod_alfa = $1) ORDER BY id_alfa ASC LIMIT 1",
      [id]
    );

    if (informesRows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "No se encontró expediente previo" });
    }

    const informe = informesRows[0];

    const { rows: dañosRows } = await client.query(
      "SELECT * FROM danios_y_montos WHERE cod_alfa_daños=$1 ORDER BY id_daños ASC LIMIT 1",
      [id]
    );

    const { rows: sectorRows } = await client.query(
      "SELECT * FROM sectores_alfa WHERE cod_alfa_sector = $1 ORDER BY id_sectores_alfa ASC LIMIT 1",
      [id]
    );

    //contribuyente = contriRows.length > 0 ? contriRows[0] : null;

    await client.query("COMMIT");

    return res.json({
      informesRows,
      dañosRows,
      sectorRows,
    });
  } catch (error) {
    console.error("Error en getNextAlfa:", error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const cteAlfa = `
WITH danios_cte AS (
  INSERT INTO danios_alfa (tipo_afectados, danio_vivienda,no_evaluado,danios_servicio,monto_danio) 
  VALUES ($1, $2, $3, $4, $5) RETURNING *
),
eval_cte AS (
  INSERT INTO evaluacion_alfa (acciones,oportunidad,recursos,necesidades,desc_necesidades,cap_respuesta,observaciones)
  VALUES ($6, $7, $8, $9, $10, $11, $12) RETURNING *
),
event_cte AS (

`;

export {
  getAllInformesALFA,
  getInformesALFA,
  createAlfa,
  updateALFA,
  deleteAlfa,
  getFuncionarioGRD,
  getLastAlfa,
  getFirstAlfa,
  getPrevAlfa,
  getNextAlfa,
};
