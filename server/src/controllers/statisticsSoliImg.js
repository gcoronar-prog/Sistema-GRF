import { pool } from "../db.js";

const getStatisticsSoliImg = async (req, res) => {
  const client = await pool.connect();
  const { whereClause, values } = buildWhereClause(req.query);
  try {
    await client.query("BEGIN");
    let soliImagen = `SELECT * FROM solicitudes_imagenes si
                        JOIN datos_solicitud_denuncia dsd ON si.id_denuncia=dsd.id_denuncia
                        JOIN datos_solicitud_grabacion dsg ON si.id_grabacion=dsg.id_grabacion
                        JOIN datos_solicitud_responsable dsr ON si.id_responsable=dsr.id_responsable
                        JOIN datos_solicitud_usuarios dsu ON si.id_usuarios_img=dsu.id_usuarios_img
                        ${whereClause}`;

    const result = await client.query(soliImagen, values);
    await client.query("COMMIT");
    return res.status(200).json({ solicitud: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexion con el servidor" });
  } finally {
    client.release();
  }
};
