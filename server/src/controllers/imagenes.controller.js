import { pool } from "../db.js";

const getDenuncia = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM datos_solicitud_denuncia");

  return res.json(rows);
};

const getSolicitudes = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const [denuncia, grabacion, responsable, usuarios] = await Promise.all([
      client.query("SELECT * FROM datos_solicitud_denuncia"),
      client.query("SELECT * FROM datos_solicitud_grabacion"),
      client.query("SELECT * FROM datos_solicitud_responsable"),
      client.query("SELECT * FROM datos_solicitud_usuarios"),
    ]);
    await client.query("COMMIT");
    return res.json({
      dato_denuncia: denuncia.rows,
      grabaciones: grabacion.rows,
      respon: responsable.rows,
      solicitante: usuarios.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Problemas obteniendo datos", error);
  } finally {
    client.release();
  }
};

const getSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");

    const solicitud = await client.query(
      "SELECT * FROM solicitudes_imagenes WHERE id_solicitud=$1",
      [id]
    );

    const denuncia = await client.query(
      "SELECT * FROM datos_solicitud_denuncia WHERE \
          id_denuncia = (SELECT id_denuncia FROM solicitudes_imagenes WHERE id_solicitud=$1)",
      [id]
    );

    const grabacion = await client.query(
      "SELECT * FROM datos_solicitud_grabacion \
           WHERE id_grabacion = (SELECT id_grabacion FROM solicitudes_imagenes WHERE id_solicitud=$1)",
      [id]
    );

    const responsable = await client.query(
      "SELECT * FROM datos_solicitud_responsable\
        WHERE id_responsable = (SELECT id_responsable FROM solicitudes_imagenes WHERE id_solicitud=$1)",
      [id]
    );

    const usuarios = await client.query(
      "SELECT * FROM datos_solicitud_usuarios\
          WHERE id_usuarios_img= (SELECT id_usuarios_img FROM solicitudes_imagenes WHERE id_solicitud=$1)",
      [id]
    );

    await client.query("COMMIT");
    return res.json({
      solicitud: solicitud.rows,
      soliDenuncia: denuncia.rows,
      soliGrabacion: grabacion.rows,
      soliResponsable: responsable.rows,
      soliUsuarios: usuarios.rows,
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

const createSolicitud = async (req, res) => {
  const client = await pool.connect();
  const data = req.body;
  try {
    await client.query("BEGIN");

    const denuncia = await client.query(
      "INSERT INTO datos_solicitud_denuncia (entidad, num_parte) VALUES ($1,$2) RETURNING *",
      [data.entidad, data.num_parte]
    );

    const grabacion = await client.query(
      "INSERT INTO datos_solicitud_grabacion \
        (descripcion_solicitud, fecha_siniestro, direccion_solicitud,sector_solicitud,camaras,estado_solicitud)\
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        data.descripcion_solicitud,
        data.fecha_siniestro,
        data.direccion_solicitud,
        data.sector_solicitud,
        data.camaras,
        data.estado_solicitud,
      ]
    );
    const responsable = await client.query(
      "INSERT INTO datos_solicitud_responsable\
      (nombre_responsable, institucion,rut_responsable) VALUES ($1,$2,$3) RETURNING *",
      [data.nombre_responsable, data.institucion, data.rut_responsable]
    );

    const usuarios = await client.query(
      "INSERT INTO datos_solicitud_usuarios\
      (fecha_solicitud,rut_solicitante,nombre_solicitante,telefono_solicitante,e_mail_solicitante)\
      VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        data.fecha_solicitud,
        data.rut_solicitante,
        data.nombre_solicitante,
        data.telefono_solicitante,
        data.e_mail_solicitante,
      ]
    );
    const idDenuncia = denuncia.rows[0].id_denuncia;
    const idGrabacion = grabacion.rows[0].id_grabacion;
    const idResponsable = responsable.rows[0].id_responsable;
    const idUsuarios = usuarios.rows[0].id_usuarios_img;

    const solicitud = await client.query(
      "INSERT INTO solicitudes_imagenes \
    (id_usuarios_img,id_responsable,id_grabacion,id_denuncia) VALUES ($1,$2,$3,$4) RETURNING *",
      [idUsuarios, idResponsable, idGrabacion, idDenuncia]
    );

    await client.query("COMMIT");
    return res.json({
      num_partes: denuncia.rows,
      grabaciones: grabacion.rows,
      persona_responsable: responsable.rows,
      solicitante: usuarios.rows,
      num_solicitud: solicitud.rows,
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

const updateSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const data = req.body;
    await client.query("BEGIN");

    const denuncia = await client.query(
      "UPDATE datos_solicitud_denuncia SET entidad=$1, num_parte=$2 WHERE \
        id_denuncia = (SELECT id_denuncia FROM solicitudes_imagenes WHERE id_solicitud=$3) RETURNING *",
      [data.entidad, data.num_parte, id]
    );

    const grabacion = await client.query(
      "UPDATE datos_solicitud_grabacion \
          SET descripcion_solicitud=$1, fecha_siniestro=$2, direccion_solicitud=$3,sector_solicitud=$4,camaras=$5,estado_solicitud=$6\
         WHERE id_grabacion = (SELECT id_grabacion FROM solicitudes_imagenes WHERE id_solicitud=$7) RETURNING *",
      [
        data.descripcion_solicitud,
        data.fecha_siniestro,
        data.direccion_solicitud,
        data.sector_solicitud,
        data.camaras,
        data.estado_solicitud,
        id,
      ]
    );
    const responsable = await client.query(
      "UPDATE datos_solicitud_responsable\
        SET nombre_responsable=$1, institucion=$2 ,rut_responsable=$3\
        WHERE id_responsable = (SELECT id_responsable FROM solicitudes_imagenes WHERE id_solicitud=$4) RETURNING *",
      [data.nombre_responsable, data.institucion, data.rut_responsable, id]
    );

    const usuarios = await client.query(
      "UPDATE datos_solicitud_usuarios\
        SET rut_solicitante=$1,nombre_solicitante=$2,telefono_solicitante=$3,e_mail_solicitante=$4\
        WHERE id_usuarios_img = (SELECT id_usuarios_img FROM solicitudes_imagenes WHERE id_solicitud=$5) RETURNING *",
      [
        data.rut_solicitante,
        data.nombre_solicitante,
        data.telefono_solicitante,
        data.e_mail_solicitante,
        id,
      ]
    );
    await client.query("COMMIT");

    return res.json({
      num_partes: denuncia.rows,
      grabaciones: grabacion.rows,
      persona_responsable: responsable.rows,
      solicitante: usuarios.rows,
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

const deleteSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");

    const selectSoli = await client.query(
      "SELECT * FROM solicitudes_imagenes WHERE id_solicitud=$1",
      [id]
    );

    const idDenuncia = selectSoli.rows[0].id_denuncia;
    const idGrabacion = selectSoli.rows[0].id_grabacion;
    const idResponsable = selectSoli.rows[0].id_responsable;
    const idUsuario = selectSoli.rows[0].id_usuarios_img;
    // console.log(idDenuncia, idGrabacion, idResponsable, idUsuario);

    const solicitud = await client.query(
      "DELETE FROM solicitudes_imagenes \
    WHERE id_solicitud=$1 RETURNING *",
      [id]
    );

    const denuncia = await client.query(
      "DELETE FROM datos_solicitud_denuncia \
        WHERE id_denuncia = $1 RETURNING *",
      [idDenuncia]
    );
    const grabacion = await client.query(
      "DELETE FROM datos_solicitud_grabacion \
        WHERE id_grabacion = $1 RETURNING *",
      [idGrabacion]
    );
    const responsable = await client.query(
      "DELETE FROM datos_solicitud_responsable\
        WHERE id_responsable = $1 RETURNING *",
      [idResponsable]
    );

    const usuarios = await client.query(
      "DELETE FROM datos_solicitud_usuarios\
        WHERE id_usuarios_img= $1 RETURNING *",
      [idUsuario]
    );

    await client.query("COMMIT");

    return res.json({
      soliAEliminar: selectSoli.rows,
      solicitudes: solicitud.rows,
      num_partes: denuncia.rows,
      grabaciones: grabacion.rows,
      persona_responsable: responsable.rows,
      solicitante: usuarios.rows,
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

const getLastSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const lastSolicitud = await client.query(
      "SELECT * FROM solicitudes_imagenes ORDER BY id_solicitud DESC LIMIT 1"
    );

    const idDenuncia = lastSolicitud.rows[0].id_denuncia;
    const idUsuarios = lastSolicitud.rows[0].id_usuarios_img;
    const idResponsable = lastSolicitud.rows[0].id_responsable;
    const idGrabacion = lastSolicitud.rows[0].id_grabacion;

    const denuncia = await client.query(
      "SELECT * FROM datos_solicitud_denuncia WHERE \
            id_denuncia =$1",
      [idDenuncia]
    );

    const grabacion = await client.query(
      "SELECT * FROM datos_solicitud_grabacion \
             WHERE id_grabacion = $1",
      [idGrabacion]
    );

    const responsable = await client.query(
      "SELECT * FROM datos_solicitud_responsable\
          WHERE id_responsable = $1",
      [idResponsable]
    );

    const usuarios = await client.query(
      "SELECT * FROM datos_solicitud_usuarios\
            WHERE id_usuarios_img= $1",
      [idUsuarios]
    );

    await client.query("COMMIT");
    console.log(lastSolicitud.rows);

    return res.json({
      ultima: lastSolicitud.rows,
      ultimoUser: usuarios.rows,
      ultimaDenuncia: denuncia.rows,
      ultimaGrabacion: grabacion.rows,
      ultimoResponsable: responsable.rows,
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

const getFirstSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const firstSolicitud = await client.query(
      "SELECT * FROM solicitudes_imagenes ORDER BY id_solicitud ASC LIMIT 1"
    );

    const idDenuncia = firstSolicitud.rows[0].id_denuncia;
    const idUsuarios = firstSolicitud.rows[0].id_usuarios_img;
    const idResponsable = firstSolicitud.rows[0].id_responsable;
    const idGrabacion = firstSolicitud.rows[0].id_grabacion;

    const denuncia = await client.query(
      "SELECT * FROM datos_solicitud_denuncia WHERE \
              id_denuncia =$1",
      [idDenuncia]
    );

    const grabacion = await client.query(
      "SELECT * FROM datos_solicitud_grabacion \
               WHERE id_grabacion = $1",
      [idGrabacion]
    );

    const responsable = await client.query(
      "SELECT * FROM datos_solicitud_responsable\
            WHERE id_responsable = $1",
      [idResponsable]
    );

    const usuarios = await client.query(
      "SELECT * FROM datos_solicitud_usuarios\
              WHERE id_usuarios_img= $1",
      [idUsuarios]
    );

    await client.query("COMMIT");

    return res.json({
      primera: firstSolicitud.rows,
      primerUser: usuarios.rows,
      priemraDenuncia: denuncia.rows,
      primeraGrabacion: grabacion.rows,
      primerResponsable: responsable.rows,
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

const getPrevSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const prevSolicitud = await client.query(
      "SELECT * FROM solicitudes_imagenes WHERE id_solicitud < $1 ORDER BY id_solicitud DESC LIMIT 1",
      [id]
    );

    const idDenuncia = prevSolicitud.rows[0].id_denuncia;
    const idUsuarios = prevSolicitud.rows[0].id_usuarios_img;
    const idResponsable = prevSolicitud.rows[0].id_responsable;
    const idGrabacion = prevSolicitud.rows[0].id_grabacion;

    const denuncia = await client.query(
      "SELECT * FROM datos_solicitud_denuncia WHERE \
                id_denuncia =$1",
      [idDenuncia]
    );

    const grabacion = await client.query(
      "SELECT * FROM datos_solicitud_grabacion \
                 WHERE id_grabacion = $1",
      [idGrabacion]
    );

    const responsable = await client.query(
      "SELECT * FROM datos_solicitud_responsable\
              WHERE id_responsable = $1",
      [idResponsable]
    );

    const usuarios = await client.query(
      "SELECT * FROM datos_solicitud_usuarios\
                WHERE id_usuarios_img= $1",
      [idUsuarios]
    );

    await client.query("COMMIT");
    return res.json({
      previo: prevSolicitud.rows,
      prevUser: usuarios.rows,
      prevDenuncia: denuncia.rows,
      prevGrabacion: grabacion.rows,
      prevResponsable: responsable.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

const getNextSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const nextSolicitud = await client.query(
      "SELECT * FROM solicitudes_imagenes WHERE id_solicitud > $1 ORDER BY id_solicitud ASC LIMIT 1",
      [id]
    );

    const idDenuncia = nextSolicitud.rows[0].id_denuncia;
    const idUsuarios = nextSolicitud.rows[0].id_usuarios_img;
    const idResponsable = nextSolicitud.rows[0].id_responsable;
    const idGrabacion = nextSolicitud.rows[0].id_grabacion;

    const denuncia = await client.query(
      "SELECT * FROM datos_solicitud_denuncia WHERE \
                  id_denuncia =$1",
      [idDenuncia]
    );

    const grabacion = await client.query(
      "SELECT * FROM datos_solicitud_grabacion \
                   WHERE id_grabacion = $1",
      [idGrabacion]
    );

    const responsable = await client.query(
      "SELECT * FROM datos_solicitud_responsable\
                WHERE id_responsable = $1",
      [idResponsable]
    );

    const usuarios = await client.query(
      "SELECT * FROM datos_solicitud_usuarios\
                  WHERE id_usuarios_img= $1",
      [idUsuarios]
    );

    await client.query("COMMIT");
    return res.json({
      next: nextSolicitud.rows,
      nextUser: usuarios.rows,
      nextDenuncia: denuncia.rows,
      nextGrabacion: grabacion.rows,
      nextResponsable: responsable.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

export {
  getSolicitud,
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
  getLastSolicitud,
  getFirstSolicitud,
  getPrevSolicitud,
  getNextSolicitud,
};
