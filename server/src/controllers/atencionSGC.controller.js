import { pool } from "../db.js";

const getAtenciones = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const [usuario, sector, solicitud, proceso, atencion] = await Promise.all([
      await client.query("SELECT * FROM datos_atencion_usuario"),
      await client.query("SELECT * FROM datos_atencion_sector"),
      await client.query("SELECT * FROM datos_atencion_solicitud"),
      await client.query("SELECT * FROM datos_atencion_procesos"),
      await client.query("SELECT * FROM atencion_ciudadana"),
    ]);

    await client.query("COMMIT");

    return res.json({
      datos_usuario: usuario.rows,
      datos_sector: sector.rows,
      datos_solicitud: solicitud.rows,
      estado_proceso: proceso.rows,
      atencion_ciudadana: atencion.rows,
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

const getAtencion2 = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");
    const atencion = await client.query(
      `
      SELECT * FROM atencion_ciudadana ac
      JOIN datos_atencion_usuario dau ON dau.id_atencion_usuarios=ac.id_atencion_usuario
      JOIN datos_atencion_sector das ON das.id_atencion_sector=ac.id_atencion_sector
      JOIN datos_atencion_solicitud daso ON daso.id_atencion_solicitud=ac.id_atencion_solicitud
      JOIN datos_atencion_procesos dap ON dap.id_atencion_proceso=ac.id_atencion_proceso
      WHERE ac.id_atencion=$1`,
      [id]
    );

    const accion_seg = await client.query(
      "SELECT * FROM acciones WHERE cod_document=$1",
      ["SGC" + id]
    );
    await client.query("COMMIT");
    return res.json({
      atencion_ciudadana: atencion.rows,
      acciones: accion_seg.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ msg: "error de conexion con el servidor" });
  } finally {
    client.release();
  }
};

const getAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");
    const atencion = await client.query(
      "SELECT * FROM atencion_ciudadana WHERE id_atencion = $1",
      [id]
    );

    const idUsuario = atencion.rows[0].id_atencion_usuario;
    const idSector = atencion.rows[0].id_atencion_sector;
    const idSolicitud = atencion.rows[0].id_atencion_solicitud;
    const idProceso = atencion.rows[0].id_atencion_proceso;

    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "SELECT * FROM datos_atencion_usuario WHERE id_atencion_usuarios = $1",
        [idUsuario]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_sector WHERE id_atencion_sector=$1",
        [idSector]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_solicitud WHERE id_atencion_solicitud = $1",
        [idSolicitud]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_procesos WHERE id_atencion_proceso=$1",
        [idProceso]
      ),
    ]);

    await client.query("COMMIT");
    console.log("backend", atencion.rows);
    return res.json({
      atencion_ciudadana: atencion.rows,
      usuario: usuario.rows,
      sector: sector.rows,
      proceso: proceso.rows,
      solicitud: solicitud.rows,
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

const createAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const data = req.body;
    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "INSERT INTO datos_atencion_usuario \
            (nombre_solicitante,telefono_solicitante,correo_solicitante,rut_solicitante) \
            VALUES ($1,$2,$3,$4) RETURNING *",
        [
          data.nombre_solicitante,
          data.telefono_solicitante,
          data.correo_solicitante,
          data.rut_solicitante,
        ]
      ),
      await client.query(
        "INSERT INTO datos_atencion_sector \
            (direccion_solicitante,sector_solicitante,poblacion_solicitante,junta_vecinos) \
            VALUES ($1,$2,$3,$4) RETURNING *",
        [
          data.direccion_solicitante,
          data.sector_solicitante,
          data.poblacion_solicitante,
          data.junta_vecinos,
        ]
      ),
      await client.query(
        "INSERT INTO datos_atencion_solicitud \
            (descripcion_solicitud,observaciones_solicitud,medidas_seguridad,espacios_publicos) \
            VALUES ($1,$2,$3,$4) RETURNING *",
        [
          data.descripcion_solicitud,
          data.observaciones_solicitud,
          data.medidas_seguridad,
          data.espacios_publicos,
        ]
      ),
      await client.query(
        "INSERT INTO datos_atencion_procesos \
            (fecha_solicitud,estado_solicitud,responsable_solicitud,medio_atencion,tipo_solicitud,temas_atencion) \
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          data.fecha_solicitud,
          data.estado_solicitud,
          data.responsable_solicitud,
          data.medio_atencion,
          data.tipo_solicitud,
          data.temas_atencion,
        ]
      ),
    ]);

    const idUsuario = usuario.rows[0].id_atencion_usuarios;
    const idSector = sector.rows[0].id_atencion_sector;
    const idSolicitud = solicitud.rows[0].id_atencion_solicitud;
    const idProceso = proceso.rows[0].id_atencion_proceso;

    const atencionCiud = await client.query(
      "INSERT INTO atencion_ciudadana\
         (id_atencion_usuario,id_atencion_sector,id_atencion_solicitud,id_atencion_proceso)\
         VALUES ($1,$2,$3,$4) RETURNING *",
      [idUsuario, idSector, idSolicitud, idProceso]
    );
    await client.query("COMMIT");

    return res.json({
      datos_usuario: usuario.rows,
      datos_sector: sector.rows,
      datos_solicitud: solicitud.rows,
      estado_proceso: proceso.rows,
      atencion_ciudadana: atencionCiud.rows,
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

const updateAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const data = req.body;
    await client.query("BEGIN");
    const atencion = await client.query(
      "SELECT * FROM atencion_ciudadana WHERE id_atencion = $1",
      [id]
    );

    const idUsuario = atencion.rows[0].id_atencion_usuario;
    const idSector = atencion.rows[0].id_atencion_sector;
    const idSolicitud = atencion.rows[0].id_atencion_solicitud;
    const idProceso = atencion.rows[0].id_atencion_proceso;

    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "UPDATE datos_atencion_usuario SET\
              nombre_solicitante=$1,telefono_solicitante=$2,correo_solicitante=$3 ,rut_solicitante=$4\
             WHERE id_atencion_usuarios = $5 RETURNING *",
        [
          data.nombre_solicitante,
          data.telefono_solicitante,
          data.correo_solicitante,
          data.rut_solicitante,
          idUsuario,
        ]
      ),
      await client.query(
        "UPDATE datos_atencion_sector SET\
              direccion_solicitante=$1,sector_solicitante=$2,poblacion_solicitante=$3,junta_vecinos=$4 \
              WHERE id_atencion_sector=$5 RETURNING *",
        [
          data.direccion_solicitante,
          data.sector_solicitante,
          data.poblacion_solicitante,
          data.junta_vecinos,
          idSector,
        ]
      ),
      await client.query(
        "UPDATE datos_atencion_solicitud SET\
              descripcion_solicitud=$1,observaciones_solicitud=$2,medidas_seguridad=$3,espacios_publicos=$4 \
              WHERE id_atencion_solicitud = $5 RETURNING *",
        [
          data.descripcion_solicitud,
          data.observaciones_solicitud,
          data.medidas_seguridad,
          data.espacios_publicos,
          idSolicitud,
        ]
      ),
      await client.query(
        "UPDATE datos_atencion_procesos SET\
              fecha_solicitud=$1,estado_solicitud=$2,responsable_solicitud=$3,medio_atencion=$4,tipo_solicitud=$5,temas_atencion=$6 \
              WHERE id_atencion_proceso=$7 RETURNING *",
        [
          data.fecha_solicitud,
          data.estado_solicitud,
          data.responsable_solicitud,
          data.medio_atencion,
          data.tipo_solicitud,
          data.temas_atencion,
          idProceso,
        ]
      ),
    ]);

    await client.query("COMMIT");
    return res.json({
      atencion_ciudadana: atencion.rows,
      update_usuario: usuario.rows,
      update_sector: sector.rows,
      update_proceso: proceso.rows,
      update_solicitud: solicitud.rows,
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

const deleteAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const atencion = await client.query(
      "SELECT * FROM atencion_ciudadana WHERE id_atencion = $1",
      [id]
    );

    const idUsuario = atencion.rows[0].id_atencion_usuario;
    const idSector = atencion.rows[0].id_atencion_sector;
    const idSolicitud = atencion.rows[0].id_atencion_solicitud;
    const idProceso = atencion.rows[0].id_atencion_proceso;

    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "DELETE FROM datos_atencion_usuario WHERE id_atencion_usuarios = $1 RETURNING *",
        [idUsuario]
      ),
      await client.query(
        "DELETE FROM datos_atencion_sector WHERE id_atencion_sector=$1 RETURNING *",
        [idSector]
      ),
      await client.query(
        "DELETE FROM datos_atencion_solicitud WHERE id_atencion_solicitud = $1 RETURNING *",
        [idSolicitud]
      ),
      await client.query(
        "DELETE FROM datos_atencion_procesos WHERE id_atencion_proceso=$1 RETURNING *",
        [idProceso]
      ),
    ]);

    await client.query("COMMIT");
    return res.json({
      atencion_ciudadana: atencion.rows,
      delete_usuario: usuario.rows,
      delete_sector: sector.rows,
      delete_proceso: proceso.rows,
      delete_solicitud: solicitud.rows,
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

const getLastAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const atencion = await client.query(
      "SELECT * FROM atencion_ciudadana ORDER BY id_atencion DESC LIMIT 1"
    );

    const idUsuario = atencion.rows[0].id_atencion_usuario;
    const idSector = atencion.rows[0].id_atencion_sector;
    const idSolicitud = atencion.rows[0].id_atencion_solicitud;
    const idProceso = atencion.rows[0].id_atencion_proceso;

    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "SELECT * FROM datos_atencion_usuario WHERE id_atencion_usuarios = $1",
        [idUsuario]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_sector WHERE id_atencion_sector=$1",
        [idSector]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_solicitud WHERE id_atencion_solicitud = $1",
        [idSolicitud]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_procesos WHERE id_atencion_proceso=$1",
        [idProceso]
      ),
    ]);
    await client.query("COMMIT");

    return res.json({
      atencion_ciudadana: atencion.rows[0],
      usuario: usuario.rows[0],
      sector: sector.rows[0],
      proceso: proceso.rows[0],
      solicitud: solicitud.rows[0],
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

const getFirstAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const atencion = await client.query(
      "SELECT * FROM atencion_ciudadana ORDER BY id_atencion ASC LIMIT 1"
    );

    const idUsuario = atencion.rows[0].id_atencion_usuario;
    const idSector = atencion.rows[0].id_atencion_sector;
    const idSolicitud = atencion.rows[0].id_atencion_solicitud;
    const idProceso = atencion.rows[0].id_atencion_proceso;

    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "SELECT * FROM datos_atencion_usuario WHERE id_atencion_usuarios = $1",
        [idUsuario]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_sector WHERE id_atencion_sector=$1",
        [idSector]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_solicitud WHERE id_atencion_solicitud = $1",
        [idSolicitud]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_procesos WHERE id_atencion_proceso=$1",
        [idProceso]
      ),
    ]);
    await client.query("COMMIT");

    return res.json({
      atencion_ciudadana: atencion.rows,
      usuario: usuario.rows,
      sector: sector.rows,
      proceso: proceso.rows,
      solicitud: solicitud.rows,
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

const getPrevAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const atencion = await client.query(
      "SELECT * FROM atencion_ciudadana WHERE id_atencion < $1 ORDER BY id_atencion DESC LIMIT 1",
      [id]
    );

    const idUsuario = atencion.rows[0].id_atencion_usuario;
    const idSector = atencion.rows[0].id_atencion_sector;
    const idSolicitud = atencion.rows[0].id_atencion_solicitud;
    const idProceso = atencion.rows[0].id_atencion_proceso;

    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "SELECT * FROM datos_atencion_usuario WHERE id_atencion_usuarios = $1",
        [idUsuario]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_sector WHERE id_atencion_sector=$1",
        [idSector]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_solicitud WHERE id_atencion_solicitud = $1",
        [idSolicitud]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_procesos WHERE id_atencion_proceso=$1",
        [idProceso]
      ),
    ]);
    await client.query("COMMIT");

    return res.json({
      atencion_ciudadana: atencion.rows,
      usuario: usuario.rows,
      sector: sector.rows,
      proceso: proceso.rows,
      solicitud: solicitud.rows,
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

const getNextAtencion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const atencion = await client.query(
      "SELECT * FROM atencion_ciudadana WHERE id_atencion > $1 ORDER BY id_atencion ASC LIMIT 1",
      [id]
    );

    const idUsuario = atencion.rows[0].id_atencion_usuario;
    const idSector = atencion.rows[0].id_atencion_sector;
    const idSolicitud = atencion.rows[0].id_atencion_solicitud;
    const idProceso = atencion.rows[0].id_atencion_proceso;

    const [usuario, sector, solicitud, proceso] = await Promise.all([
      await client.query(
        "SELECT * FROM datos_atencion_usuario WHERE id_atencion_usuarios = $1",
        [idUsuario]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_sector WHERE id_atencion_sector=$1",
        [idSector]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_solicitud WHERE id_atencion_solicitud = $1",
        [idSolicitud]
      ),
      await client.query(
        "SELECT * FROM datos_atencion_procesos WHERE id_atencion_proceso=$1",
        [idProceso]
      ),
    ]);
    await client.query("COMMIT");

    return res.json({
      atencion_ciudadana: atencion.rows,
      usuario: usuario.rows,
      sector: sector.rows,
      proceso: proceso.rows,
      solicitud: solicitud.rows,
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

const getArchivosAten = async (req, res) => {
  try {
    const { rows } = await pool.query("select * from doc_adjuntos");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encuentran registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const findArchivosAten = async (id) => {
  try {
    //const { id } = req.params;

    const { rows } = await pool.query(
      "SELECT * FROM doc_adjuntos WHERE id_atencion=($1)",
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
    /*return res
        .status(500)
        .json({ message: "Error de conexión con el servidor" });*/
  }
};

const findArchivosByIdAten = async (id) => {
  try {
    //const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM doc_adjuntos WHERE id_adjunto=($1)",
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
    /*return res
        .status(500)
        .json({ message: "Error de conexión con el servidor" });*/
  }
};

const createArchivoAten = async (fileUrl, idAtencion) => {
  try {
    console.log("id atencion: ", idAtencion);
    const { rows } = await pool.query(
      "INSERT INTO doc_adjuntos (path_document,id_atencion) VALUES ($1,$2) RETURNING *",
      [fileUrl, idAtencion]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

const deleteArchivoAten = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM doc_adjuntos WHERE id_adjunto = $1 RETURNING *",
      [id]
    );
    console.log("id del reporte" + id);
    const filePath = path.join("uploads", rows[0].path_document);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Archivo físico eliminado");
    } else {
      console.log("El archivo no existe en el sistema de archivos");
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    return res.status(200).json({ message: "Archivo eliminado" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getPoblaciones = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM datos_poblacion ORDER BY id_poblacion ASC"
    );
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

export {
  getAtenciones,
  createAtencion,
  updateAtencion,
  deleteAtencion,
  getAtencion,
  getLastAtencion,
  getFirstAtencion,
  getPrevAtencion,
  getNextAtencion,
  getArchivosAten,
  findArchivosAten,
  findArchivosByIdAten,
  createArchivoAten,
  deleteArchivoAten,
  getPoblaciones,
  getAtencion2,
};
