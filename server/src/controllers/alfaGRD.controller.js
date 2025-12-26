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
    const informeAlfa = await client.query(
      `SELECT * FROM informes_alfa ia
        LEFT JOIN danios_alfa da ON ia.id_danios=da.id_danios
        LEFT JOIN evaluacion_alfa ea ON ia.id_evaluacion=ea.id_evaluacion
        LEFT JOIN eventos_alfa eva ON ia.id_evento=eva.id_evento
        LEFT JOIN responsable_alfa ra ON ia.id_responsable=ra.id_responsable
        LEFT JOIN sectores_alfa sa ON ia.id_sector=sa.id_sector
        WHERE ia.id_alfa = $1`,
      [id]
    );

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
  //const client = await pool.connect();
  const data = req.body;
  try {
    const {
      rows: [result],
    } = await pool.query(cteAlfa, [
      //danios_cte
      data.tipo_afectados,
      data.danio_vivienda,
      data.no_evaluado,
      data.danios_servicio,
      data.monto_danio,
      //eval_cte
      data.acciones,
      data.oportunidad,
      data.recursos,
      data.necesidades,
      data.desc_necesidades,
      data.cap_respuesta,
      data.observaciones,
      //event_cte
      data.fuente_info,
      data.telefono,
      data.tipo_evento,
      data.escala_sismo,
      data.otro_evento,
      data.direccion,
      data.tipo_ubicacion,
      data.desc_evento,
      data.fecha_ocurrencia,
      //resp_cte
      data.funcionario,
      data.fecha_documento,
      //sector_cte
      data.region,
      data.provincia,
      data.comuna,
    ]);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problema de conexion con servidor" });
  }
};

const updateALFA = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const { rows: result } = await pool.query(cteUpdateAlfa, [
      id,
      //danios_cte
      data.tipo_afectados,
      data.danio_vivienda,
      data.no_evaluado,
      data.danios_servicio,
      data.monto_danio,
      //eval_cte
      data.acciones,
      data.oportunidad,
      data.recursos,
      data.necesidades,
      data.desc_necesidades,
      data.cap_respuesta,
      data.observaciones,
      //event_cte
      data.fuente_info,
      data.telefono,
      data.tipo_evento,
      data.escala_sismo,
      data.otro_evento,
      data.direccion,
      data.tipo_ubicacion,
      data.desc_evento,
      data.fecha_ocurrencia,
      //resp_cte
      data.funcionario,
      data.fecha_documento,
      //sector_cte
      data.region,
      data.provincia,
      data.comuna,
    ]);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problema de conexion con servidor" });
  }
};

const deleteAlfa = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: result } = await pool.query(cteDeleteAlfa, [id]);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problema de conexion con servidor" });
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
  try {
    const { rows: result } = await pool.query(`
        SELECT * FROM informes_alfa ia
          LEFT JOIN danios_alfa da ON ia.id_danios=da.id_danios
          LEFT JOIN evaluacion_alfa ea ON ia.id_evaluacion=ea.id_evaluacion
          LEFT JOIN eventos_alfa eva ON ia.id_evento=eva.id_evento
          LEFT JOIN responsable_alfa ra ON ia.id_responsable=ra.id_responsable
          LEFT JOIN sectores_alfa sa ON ia.id_sector=sa.id_sector
          ORDER BY ia.id_alfa DESC LIMIT 1`);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getFirstAlfa = async (req, res) => {
  try {
    const { rows: result } = await pool.query(`
          SELECT * FROM informes_alfa ia
              LEFT JOIN danios_alfa da ON ia.id_danios=da.id_danios
              LEFT JOIN evaluacion_alfa ea ON ia.id_evaluacion=ea.id_evaluacion
              LEFT JOIN eventos_alfa eva ON ia.id_evento=eva.id_evento
              LEFT JOIN responsable_alfa ra ON ia.id_responsable=ra.id_responsable
              LEFT JOIN sectores_alfa sa ON ia.id_sector=sa.id_sector
      ORDER BY ia.id_alfa ASC LIMIT 1`);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getPrevAlfa = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: result } = await pool.query(
      `SELECT * FROM informes_alfa ia
          LEFT JOIN danios_alfa da ON ia.id_danios=da.id_danios
          LEFT JOIN evaluacion_alfa ea ON ia.id_evaluacion=ea.id_evaluacion
          LEFT JOIN eventos_alfa eva ON ia.id_evento=eva.id_evento
          LEFT JOIN responsable_alfa ra ON ia.id_responsable=ra.id_responsable
          LEFT JOIN sectores_alfa sa ON ia.id_sector=sa.id_sector
      WHERE ia.id_alfa < $1
      ORDER BY ia.id_alfa DESC LIMIT 1
      `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontró informe previo" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getPrevAlfa:", error);

    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getNextAlfa = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: result } = await pool.query(
      `
      SELECT * FROM informes_alfa ia
          LEFT JOIN danios_alfa da ON ia.id_danios=da.id_danios
          LEFT JOIN evaluacion_alfa ea ON ia.id_evaluacion=ea.id_evaluacion
          LEFT JOIN eventos_alfa eva ON ia.id_evento=eva.id_evento
          LEFT JOIN responsable_alfa ra ON ia.id_responsable=ra.id_responsable
          LEFT JOIN sectores_alfa sa ON ia.id_sector=sa.id_sector
      WHERE ia.id_alfa > $1
      ORDER BY ia.id_alfa ASC LIMIT 1`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontró informe previo" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getNextAlfa:", error);

    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const cteAlfa = `
WITH danios_cte AS (
  INSERT INTO danios_alfa (tipo_afectados, danio_vivienda,no_evaluado,danios_servicios,monto_danio) 
  VALUES ($1, $2, $3, $4, $5) RETURNING *
),
eval_cte AS (
  INSERT INTO evaluacion_alfa (acciones,oportunidad,recursos,necesidades,desc_necesidades,cap_respuesta,observaciones)
  VALUES ($6, $7, $8, $9, $10, $11, $12) RETURNING *
),
event_cte AS (
  INSERT INTO eventos_alfa (fuente_info, telefono,tipo_evento,escala_sismo,otro_evento,direccion,tipo_ubicacion,desc_evento,fecha_ocurrencia)
  VALUES ($13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *
),
resp_cte AS (
  INSERT INTO responsable_alfa (funcionario, fecha_documento)
  VALUES ($22, $23) RETURNING *
),
sector_cte AS (
  INSERT INTO sectores_alfa (region, provincia, comuna)
  VALUES ($24, $25, $26) RETURNING *
  )
  INSERT INTO informes_alfa (id_danios,id_evaluacion,id_evento,id_responsable,id_sector)
  VALUES (
    (SELECT id_danios FROM danios_cte),
    (SELECT id_evaluacion FROM eval_cte),
    (SELECT id_evento FROM event_cte),
    (SELECT id_responsable FROM resp_cte),
    (SELECT id_sector FROM sector_cte)
    ) RETURNING *`;

const cteUpdateAlfa = `WITH upd_alfa AS 
(SELECT * FROM informes_alfa WHERE id_alfa=$1),

danios_cte AS (
  UPDATE danios_alfa d SET tipo_afectados=$2, danio_vivienda=$3,no_evaluado=$4,danios_servicios=$5,monto_danio=$6
  FROM upd_alfa u
  WHERE d.id_danios=u.id_danios RETURNING d.id_danios
  ),
eval_cte AS (
  UPDATE evaluacion_alfa e SET acciones=$7,oportunidad=$8,recursos=$9,necesidades=$10,desc_necesidades=$11,
  cap_respuesta=$12,observaciones=$13
  FROM upd_alfa u
    WHERE e.id_evaluacion=u.id_evaluacion RETURNING e.id_evaluacion
    ),
event_cte AS (
  UPDATE eventos_alfa ev SET fuente_info=$14, telefono=$15,tipo_evento=$16,escala_sismo=$17,otro_evento=$18,
  direccion=$19,tipo_ubicacion=$20,desc_evento=$21,fecha_ocurrencia=$22
  FROM upd_alfa u
    WHERE ev.id_evento=u.id_evento RETURNING ev.id_evento
    ),
resp_cte AS (
  UPDATE responsable_alfa r SET funcionario=$23, fecha_documento=$24
  FROM upd_alfa u
    WHERE r.id_responsable=u.id_responsable RETURNING r.id_responsable
    ),
sector_cte AS (
  UPDATE sectores_alfa s SET region=$25, provincia=$26, comuna=$27
  FROM upd_alfa u
    WHERE s.id_sector=u.id_sector RETURNING s.id_sector
  )

  SELECT
    (SELECT id_danios FROM danios_cte) AS id_danios,
  (SELECT id_evaluacion FROM eval_cte) AS id_evaluacion,
  (SELECT id_evento FROM event_cte) AS id_evento,
  (SELECT id_responsable FROM resp_cte) AS id_responsable
  `;
const cteDeleteAlfa = `
WITH del_alfa AS 
(SELECT * FROM informes_alfa WHERE id_alfa=$1),
danios_cte AS (
  DELETE FROM danios_alfa d 
  USING del_alfa u
  WHERE d.id_danios=u.id_danios RETURNING d.*
  ),
eval_cte AS (
  DELETE FROM evaluacion_alfa e 
  USING del_alfa u
    WHERE e.id_evaluacion=u.id_evaluacion RETURNING e.*
    ),
event_cte AS (
  DELETE FROM eventos_alfa ev
  USING del_alfa u
    WHERE ev.id_evento=u.id_evento RETURNING ev.*
    ),
resp_cte AS (
  DELETE FROM responsable_alfa r 
  USING del_alfa u
    WHERE r.id_responsable=u.id_responsable RETURNING r.*
    ),
sector_cte AS (
  DELETE FROM sectores_alfa s 
  USING del_alfa u
    WHERE s.id_sector=u.id_sector RETURNING s.*
  )
  DELETE FROM informes_alfa ia
  USING del_alfa u
  WHERE ia.id_alfa=u.id_alfa RETURNING ia.*
`;
const cteGeLastAlfa = `
WITH last_alfa AS (
  SELECT * FROM informes_alfa ORDER BY id_alfa DESC LIMIT 1
  ),
  last_danios AS (
  SELECT * FROM danios_alfa WHERE id_danios = (SELECT id_danios FROM last_alfa)
  ),
  last_sector AS(
  SELECT * FROM sectores_alfa WHERE id_sector = (SELECT id_sector FROM last_alfa)
  ),
  last_evaluacion AS(
  SELECT * FROM evaluacion_alfa WHERE id_evaluacion = (SELECT id_evaluacion FROM last_alfa)
  ),
  last_evento AS( 
  SELECT * FROM eventos_alfa WHERE id_evento = (SELECT id_evento FROM last_alfa)
  ),
  last_responsable AS (
  SELECT * FROM responsable_alfa WHERE id_responsable = (SELECT id_responsable FROM last_alfa)
  )
 SELECT
  (SELECT id_alfa FROM last_alfa) AS informe_alfa,
  (SELECT id_danios FROM last_danios) AS danios,
  (SELECT id_sector FROM last_sector) AS sector,
  (SELECT id_evaluacion FROM last_evaluacion) AS evaluacion,
  (SELECT id_evento FROM last_evento) AS evento,
  (SELECT id_responsable FROM last_responsable) AS responsable
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
