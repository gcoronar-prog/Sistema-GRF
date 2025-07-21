import { info } from "console";
import { pool } from "../db.js";

const getInformes = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const informes = await client.query("SELECT * FROM informes_central");
    const origen = await client.query("SELECT * FROM datos_origen_informe");
    const tipos = await client.query("SELECT * FROM datos_tipos_informes");
    const ubicacion = await client.query(
      "SELECT * FROM datos_ubicacion_informe"
    );
    const vehiculos = await client.query(
      "SELECT * FROM datos_vehiculos_informe"
    );
    await client.query("COMMIT");
    return res.status(200).json({
      informes: informes.rows,
      origen: origen.rows,
      tipos: tipos.rows,
      ubicacion: ubicacion.rows,
      vehiculos: vehiculos.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

const getInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");

    const informe = await client.query(
      "SELECT \
          ic.*,\
          doi.* AS origen_informe,\
          dti.* AS tipo_informe,\
          dui.* AS ubicacion_informe,\
          dvi.* AS vehiculo_informe\
      FROM \
          informes_central ic\
      LEFT JOIN \
          datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
      LEFT JOIN \
          datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      LEFT JOIN \
          datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
      LEFT JOIN \
          datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
        WHERE ic.id_informes_central=$1",
      [id]
    );

    const acciones = await client.query(
      `SELECT * FROM acciones WHERE cod_document=$1`,
      [informe.rows[0].cod_informes_central]
    );
    await client.query("COMMIT");

    return res.status(200).json({
      informe: informe.rows,
      acciones: acciones.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

const searchInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.query;
    await client.query("BEGIN");

    const informe = await client.query(
      "SELECT \
          ic.*,\
          doi.* AS origen_informe,\
          dti.* AS tipo_informe,\
          dui.* AS ubicacion_informe,\
          dvi.* AS vehiculo_informe\
      FROM \
          informes_central ic\
      LEFT JOIN \
          datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
      LEFT JOIN \
          datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      LEFT JOIN \
          datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
      LEFT JOIN \
          datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
        WHERE ic.cod_informes_central=$1",
      [id]
    );

    await client.query("COMMIT");
    return res.status(200).json({
      informe: informe.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

const createInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    const data = req.body;
    await client.query("BEGIN");
    const [origen, tipos, ubicacion, vehiculo] = await Promise.all([
      await client.query(
        "INSERT INTO datos_origen_informe (fecha_informe,\
        origen_informe,persona_informante,captura_informe,estado_informe,user_creador)\
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          data.fecha_informe,
          data.origen_informe,
          data.persona_informante,
          data.captura_informe,
          data.estado_informe,
          data.user_creador,
        ]
      ),
      await client.query(
        "INSERT INTO datos_tipos_informes (tipo_informe, otro_tipo,\
      descripcion_informe, recursos_informe,clasificacion_informe)\
         VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [
          data.tipo_informe,
          data.otro_tipo,
          data.descripcion_informe,
          data.recursos_informe,
          data.clasificacion_informe,
        ]
      ),
      await client.query(
        "INSERT INTO datos_ubicacion_informe (\
          sector_informe, direccion_informe)\
          VALUES ($1,$2) RETURNING *",
        [data.sector_informe, data.direccion_informe]
      ),

      await client.query(
        "INSERT INTO datos_vehiculos_informe (vehiculos_informe, tripulantes_informe)\
        VALUES ($1,$2) RETURNING *",
        [data.vehiculos_informe, data.tripulantes_informe]
      ),
    ]);

    const idOrigen = origen.rows[0].id_origen_informe;
    const idTipos = tipos.rows[0].id_tipos_informes;
    const idUbicacion = ubicacion.rows[0].id_ubicacion;
    const idVehiculo = vehiculo.rows[0].id_vehiculos;

    const informe = await client.query(
      "INSERT INTO informes_central (id_origen_informe,id_tipos_informe,\
            id_ubicacion_informe,id_vehiculo_informe) \
            VALUES ($1,$2,$3,$4)",
      [idOrigen, idTipos, idUbicacion, idVehiculo]
    );
    await client.query("COMMIT");
    return res.status(200).json({
      origen: origen.rows,
      tipos: tipos.rows,
      ubicacion: ubicacion.rows,
      vehiculo: vehiculo.rows,
      informe: informe.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const updateInformeCentral = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const data = req.body;
    await client.query("BEGIN");
    const informeCentral = await client.query(
      "SELECT * FROM informes_central WHERE id_informes_central = $1",
      [id]
    );

    const idOrigen = informeCentral.rows[0].id_origen_informe;
    const idTipos = informeCentral.rows[0].id_tipos_informe;
    const idUbicacion = informeCentral.rows[0].id_ubicacion_informe;
    const idVehiculo = informeCentral.rows[0].id_vehiculo_informe;

    console.log(req.body);
    const [origen, tipos, ubicacion, vehiculo] = await Promise.all([
      await client.query(
        "UPDATE datos_origen_informe SET fecha_informe=$1,\
        origen_informe=$2,persona_informante=$3,captura_informe=$4,\
        estado_informe=$5, user_creador=$6 WHERE id_origen_informe=$7 RETURNING *",
        [
          data.fecha_informe,
          data.origen_informe,
          data.persona_informante,
          data.captura_informe,
          data.estado_informe,
          data.user_creador,
          idOrigen,
        ]
      ),
      await client.query(
        "UPDATE datos_tipos_informes SET tipo_informe=$1, otro_tipo=$2,\
      descripcion_informe=$3, recursos_informe=$4,clasificacion_informe=$5 WHERE id_tipos_informes=$6 RETURNING *",
        [
          data.tipo_informe,
          data.otro_tipo,
          data.descripcion_informe,
          data.recursos_informe,
          data.clasificacion_informe,
          idTipos,
        ]
      ),
      await client.query(
        "UPDATE datos_ubicacion_informe SET sector_informe=$1, direccion_informe=$2 WHERE id_ubicacion=$3 RETURNING *",
        [data.sector_informe, data.direccion_informe, idUbicacion]
      ),
      await client.query(
        "UPDATE datos_vehiculos_informe SET vehiculos_informe=$1, tripulantes_informe=$2 WHERE id_vehiculos=$3 RETURNING *",
        [data.vehiculos_informe, data.tripulantes_informe, idVehiculo]
      ),
    ]);
    await client.query("COMMIT");
    return res.status(200).json({
      origen: origen.rows,
      tipos: tipos.rows,
      ubicacion: ubicacion.rows,
      vehiculo: vehiculo.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const deleteInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const informe = await client.query(
      "SELECT * FROM informes_central WHERE id_informes_central = $1",
      [id]
    );
    const idOrigen = informe.rows[0].id_origen_informe;
    const idTipos = informe.rows[0].id_tipos_informe;
    const idUbicacion = informe.rows[0].id_ubicacion_informe;
    const idVehiculo = informe.rows[0].id_vehiculo_informe;

    const informeDelete = await client.query(
      "DELETE FROM informes_central WHERE id_informes_central=$1 RETURNING *",
      [id]
    );
    const origen = await client.query(
      "DELETE FROM datos_origen_informe WHERE id_origen_informe=$1 RETURNING *",
      [idOrigen]
    );
    const tipos = await client.query(
      "DELETE FROM datos_tipos_informes WHERE id_tipos_informes=$1 RETURNING *",
      [idTipos]
    );
    const ubicacion = await client.query(
      "DELETE FROM datos_ubicacion_informe WHERE id_ubicacion=$1 RETURNING *",
      [idUbicacion]
    );
    const vehiculo = await client.query(
      "DELETE FROM datos_vehiculos_informe WHERE id_vehiculos=$1 RETURNING *",
      [idVehiculo]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      informe: informeDelete.rows,
      origen: origen.rows,
      tipos: tipos.rows,
      ubicacion: ubicacion.rows,
      vehiculo: vehiculo.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getLastInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const informe = await client.query(
      "SELECT \
          ic.*,\
          doi.* AS origen_informe,\
          dti.* AS tipo_informe,\
          dui.* AS ubicacion_informe,\
          dvi.* AS vehiculo_informe\
      FROM \
          informes_central ic\
      LEFT JOIN \
          datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
      LEFT JOIN \
          datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      LEFT JOIN \
          datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
      LEFT JOIN \
          datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
        ORDER BY ic.id_informes_central DESC LIMIT 1"
    );

    await client.query("COMMIT");
    return res.status(200).json({
      informe: informe.rows,
    });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getFirstInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    /*const informe = await client.query(
      "SELECT * FROM informes_central ORDER BY id_informes_central ASC LIMIT 1"
    );
    const idOrigen = informe.rows[0].id_origen_informe;
    const idTipos = informe.rows[0].id_tipos_informe;
    const idUbicacion = informe.rows[0].id_ubicacion_informe;
    const idVehiculo = informe.rows[0].id_vehiculo_informe;

    const origen = await client.query(
      "SELECT * FROM datos_origen_informe WHERE id_origen_informe=$1",
      [idOrigen]
    );

    const tipos = await client.query(
      "SELECT * FROM datos_tipos_informes WHERE id_tipos_informes=$1",
      [idTipos]
    );

    const ubicacion = await client.query(
      "SELECT * FROM datos_ubicacion_informe WHERE id_ubicacion=$1",
      [idUbicacion]
    );

    const vehiculo = await client.query(
      "SELECT * FROM datos_vehiculos_informe WHERE id_vehiculos=$1",
      [idVehiculo]
    );*/

    const informe = await client.query(
      "SELECT \
          ic.*,\
          doi.* AS origen_informe,\
          dti.* AS tipo_informe,\
          dui.* AS ubicacion_informe,\
          dvi.* AS vehiculo_informe\
      FROM \
          informes_central ic\
      LEFT JOIN \
          datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
      LEFT JOIN \
          datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      LEFT JOIN \
          datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
      LEFT JOIN \
          datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
        ORDER BY ic.id_informes_central ASC LIMIT 1"
    );

    await client.query("COMMIT");
    return res.status(200).json({
      informe: informe.rows,
      /* origen: origen.rows,
      tipos: tipos.rows,
      ubicacion: ubicacion.rows,
      vehiculo: vehiculo.rows,*/
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getPrevInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    /*const informe = await client.query(
      "SELECT * FROM informes_central WHERE id_informes_central < $1 ORDER BY id_informes_central DESC LIMIT 1",
      [id]
    );

    const idOrigen = informe.rows[0].id_origen_informe;
    const idTipos = informe.rows[0].id_tipos_informe;
    const idUbicacion = informe.rows[0].id_ubicacion_informe;
    const idVehiculo = informe.rows[0].id_vehiculo_informe;
    const origen = await client.query(
      "SELECT * FROM datos_origen_informe WHERE id_origen_informe=$1",
      [idOrigen]
    );

    const tipos = await client.query(
      "SELECT * FROM datos_tipos_informes WHERE id_tipos_informes=$1",
      [idTipos]
    );

    const ubicacion = await client.query(
      "SELECT * FROM datos_ubicacion_informe WHERE id_ubicacion=$1",
      [idUbicacion]
    );

    const vehiculo = await client.query(
      "SELECT * FROM datos_vehiculos_informe WHERE id_vehiculos=$1",
      [idVehiculo]
    );*/

    const informe = await client.query(
      "SELECT \
          ic.*,\
          doi.* AS origen_informe,\
          dti.* AS tipo_informe,\
          dui.* AS ubicacion_informe,\
          dvi.* AS vehiculo_informe\
      FROM \
          informes_central ic\
      LEFT JOIN \
          datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
      LEFT JOIN \
          datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      LEFT JOIN \
          datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
      LEFT JOIN \
          datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
        WHERE ic.id_informes_central< $1 ORDER BY ic.id_informes_central DESC LIMIT 1",
      [id]
    );

    await client.query("COMMIT");
    return res.status(200).json({
      informe: informe.rows,
      /*origen: origen.rows,
      tipos: tipos.rows,
      ubicacion: ubicacion.rows,
      vehiculo: vehiculo.rows,*/
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getNextInformeCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");

    const informe = await client.query(
      "SELECT \
          ic.*,\
          doi.* AS origen_informe,\
          dti.* AS tipo_informe,\
          dui.* AS ubicacion_informe,\
          dvi.* AS vehiculo_informe\
      FROM \
          informes_central ic\
      LEFT JOIN \
          datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
      LEFT JOIN \
          datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      LEFT JOIN \
          datos_ubicacion_informe dui ON ic.id_ubicacion_informe = dui.id_ubicacion\
      LEFT JOIN \
          datos_vehiculos_informe dvi ON ic.id_vehiculo_informe = dvi.id_vehiculos\
        WHERE ic.id_informes_central > $1 ORDER BY ic.id_informes_central ASC LIMIT 1",
      [id]
    );

    await client.query("COMMIT");
    return res.status(200).json({
      informe: informe.rows,
      /*origen: origen.rows,
      tipos: tipos.rows,
      ubicacion: ubicacion.rows,
      vehiculo: vehiculo.rows,*/
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getPendientes = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const pendientes = await client.query(
      "SELECT ic.*, doi.* AS origen_informe,dti.* AS tipo_informe\
        FROM informes_central ic\
        JOIN datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
        JOIN datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      WHERE doi.estado_informe='pendiente' ORDER BY ic.id_informes_central ASC"
    );

    await client.query("COMMIT");
    return res.status(200).json({
      informe: pendientes.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getProgreso = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const progresos = await client.query(
      "SELECT ic.*, doi.* AS origen_informe,dti.* AS tipo_informe\
        FROM informes_central ic\
        JOIN datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
        JOIN datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      WHERE doi.estado_informe='progreso' ORDER BY ic.id_informes_central ASC"
    );
    await client.query("COMMIT");
    return res.status(200).json({
      informe: progresos.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

//// Archivos adjuntos
const getArchivos = async (req, res) => {
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

const findArchivos = async (id) => {
  try {
    //const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM doc_adjuntos WHERE id_reporte=($1)",
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

const findArchivosById = async (id) => {
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

const createArchivo = async (fileUrl, idReporte) => {
  try {
    /*const data = req.body;*/
    const { rows } = await pool.query(
      "INSERT INTO doc_adjuntos (path_document,id_reporte) VALUES ($1,$2) RETURNING *",
      [fileUrl, idReporte]
    );

    /* return res.json(rows[0]).json({ message: "Archivo subido" });*/
    return rows[0];
  } catch (error) {
    /* return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });*/
    console.log(error);
  }
};

const deleteArchivo = async (req, res) => {
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

const getEmergencias = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const emergencia = await client.query(
      "SELECT ic.*, doi.* AS origen_informe,dti.* AS tipo_informe\
        FROM informes_central ic\
        JOIN datos_origen_informe doi ON ic.id_origen_informe = doi.id_origen_informe\
        JOIN datos_tipos_informes dti ON ic.id_tipos_informe = dti.id_tipos_informes\
      WHERE (dti.clasificacion_informe->>'value')::int = 1 ORDER BY ic.id_informes_central ASC"
    );

    await client.query("COMMIT");
    return res.status(200).json({ informe: emergencia.rows });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};

const getAcciones = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const acciones = await client.query(
      `SELECT * FROM acciones ac 
      JOIN informes_central ic 
      ON ac.cod_document=ic.cod_informes_central WHERE ic.id_informes_central=$1`,
      [id]
    );

    await client.query("COMMIT");
    console.log(acciones.rows);
    return res.status(200).json({ acciones: acciones.rows });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Problemas con el servidor" });
  } finally {
    client.release();
  }
};
export {
  getInformes,
  getInformeCentral,
  createInformeCentral,
  updateInformeCentral,
  deleteInformeCentral,
  getLastInformeCentral,
  getFirstInformeCentral,
  getPrevInformeCentral,
  getNextInformeCentral,
  getPendientes,
  getProgreso,
  createArchivo,
  deleteArchivo,
  findArchivos,
  findArchivosById,
  searchInformeCentral,
  getEmergencias,
  getAcciones,
};
