import { pool } from "../db.js";

const getAcciones = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM acciones");
  if (!rows.length) throw new Error("Hubo un error obteniendo registros");

  return res.json(rows);
};

const getAccionesId = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    await client.query("BEGIN");

    const accion = await client.query(
      "SELECT * FROM acciones\
         WHERE cod_document = \
         (SELECT cod_atencion FROM atencion_ciudadana WHERE id_atencion =$1 )",
      [id]
    );

    await client.query("COMMIT");
    return res.json({
      acciones: accion.rows,
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

const getAccionesCentral = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    await client.query("BEGIN");

    const accion = await client.query(
      "SELECT * FROM acciones\
         WHERE cod_document = \
         (SELECT cod_informes_central FROM informes_central WHERE id_informes_central =$1 )",
      [id]
    );

    await client.query("COMMIT");
    return res.json({
      acciones: accion.rows,
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

const createAccion = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const data = req.body;
    const codigoSegC = await client.query(
      "SELECT cod_atencion FROM atencion_ciudadana WHERE id_atencion =$1",
      [id]
    );

    const acciones = await client.query(
      "INSERT INTO acciones \
        (fecha_accion,desc_acciones,cod_document,estado_accion,fecha_resolucion)\
        VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        data.fecha_accion,
        data.desc_acciones,
        codigoSegC.rows[0].cod_atencion,
        data.estado_accion,
        data.fecha_resolucion,
      ]
    );

    await client.query("COMMIT");
    return res.json({
      accion: acciones.rows,
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

const createAccionCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const data = req.body;
    const codigoCentral = await client.query(
      "SELECT cod_informes_central FROM informes_central WHERE id_informes_central =$1",
      [id]
    );

    const acciones = await client.query(
      "INSERT INTO acciones \
        (fecha_accion,desc_acciones,cod_document,estado_accion,fecha_resolucion)\
        VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        data.fecha_accion,
        data.desc_acciones,
        codigoCentral.rows[0].cod_informes_central,
        data.estado_accion,
        data.fecha_resolucion,
      ]
    );

    await client.query("COMMIT");
    return res.json({
      accion: acciones.rows,
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

const updateAccion = async (req, res) => {
  const client = await pool.connect();
  try {
    //const { id } = req.params;
    const data = req.body;
    await client.query("BEGIN");
    const accion = await client.query(
      "UPDATE acciones SET \
            fecha_accion=$1,desc_acciones=$2,estado_accion=$3,fecha_resolucion=$4\
            WHERE cod_accion=$5 RETURNING *",
      [
        data.fecha_accion,
        data.desc_acciones,
        data.estado_accion,
        data.fecha_resolucion,
        data.cod_accion,
      ]
    );
    await client.query("COMMIT");
    return res.json({
      acciones: accion.rows,
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

const deleteAccion = async (req, res) => {
  const client = await pool.connect();
  try {
    //const data = req.body;
    const { id } = req.params;
    await client.query("BEGIN");
    const accion = await client.query(
      "DELETE FROM acciones WHERE cod_accion = $1 RETURNING *",
      [id]
    );
    await client.query("COMMIT");
    return res.json({
      acciones: accion.rows,
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

export {
  getAcciones,
  getAccionesId,
  getAccionesCentral,
  createAccion,
  createAccionCentral,
  updateAccion,
  deleteAccion,
};
