import { pool } from "../db.js";

const getReportes = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM reportes_servicios_central");
  return res.json(rows);
};

const getReporte = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const report = await client.query(
      "SELECT * FROM reportes_servicios_central WHERE id_reporte_service =$1",
      [id]
    );
    await client.query("COMMIT");
    return res.json({ reporte_seleccionado: report.rows });
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

const createReporte = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const data = req.body;
    const reporte = client.query(
      "INSERT INTO reportes_servicios_central(fecha_reporte,usuario_reporte,vehiculo_reporte,tipo_reporte,usuario_crea)\
        VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        data.fecha_reporte,
        data.usuario_reporte,
        data.vehiculo_reporte,
        data.tipo_reporte,
        data.usuario_crea,
      ]
    );
    await client.query("COMMIT");

    return res.json({ reporteNuevo: reporte.rows });
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

const updateReporte = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const data = req.body;
    const { id } = req.params;
    const reporte = client.query(
      "UPDATE reportes_servicios_central SET fecha_reporte=$1,usuario_reporte=$2,vehiculo_reporte=$3,tipo_reporte=$4,usuario_crea=$5\
        WHERE id_reporte_service=$6 RETURNING *",
      [
        data.fecha_reporte,
        data.usuario_reporte,
        data.vehiculo_reporte,
        data.tipo_reporte,
        data.usuario_crea,
        id,
      ]
    );
    await client.query("COMMIT");

    return res.json({ reporte_actualizado: reporte.rows });
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

const deleteReporte = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    await client.query(
      "DELETE FROM reportes_servicios_central WHERE id_reporte_service=$1",
      [id]
    );
    await client.query("COMMIT");
    return res.json({ message: "Reporte eliminado" });
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

const getFirstReporte = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM reportes_servicios_central ORDER BY id_reporte_service ASC LIMIT 1"
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "No hay reportes" });
  }
  return res.json(rows);
};

const getLastReporte = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM reportes_servicios_central ORDER BY id_reporte_service DESC LIMIT 1"
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "No hay reportes" });
  }
  console.log(rows);
  return res.json(rows);
};

const getPrevReporte = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "SELECT * FROM reportes_servicios_central WHERE id_reporte_service < $1 ORDER BY id_reporte_service DESC LIMIT 1",
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "No hay reportes" });
  }
  return res.json(rows);
};

const getNextReporte = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "SELECT * FROM reportes_servicios_central WHERE id_reporte_service > $1 ORDER BY id_reporte_service ASC LIMIT 1",
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "No hay reportes" });
  }
  return res.json(rows);
};

export {
  getReportes,
  getReporte,
  createReporte,
  updateReporte,
  deleteReporte,
  getFirstReporte,
  getLastReporte,
  getPrevReporte,
  getNextReporte,
};
