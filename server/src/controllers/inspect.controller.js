import { pool } from "../db.js";

const getExpedientes = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM expedientes");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen expedientes" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Problemas de conexión al servidor" });
  }
};

const getExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM expedientes WHERE id_expediente = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen expedientes" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Problemas de conexión con el servidor" });
  }
};

const createEXfiles = async (req, res) => {
  try {
    console.log("datos body", req.body);
    const data = req.body;
    const { rows } = await pool.query(
      "INSERT INTO expedientes(fecha_resolucion,user_creador,tipo_procedimiento,empadronado,inspector,testigo,id_inspector,id_leyes,id_vehiculos,id_infracciones) \
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [
        data.fecha_resolucion,
        data.user_creador,
        data.tipo_procedimiento,
        data.empadronado,
        data.inspector,
        data.testigo,

        data.id_inspector,

        data.id_leyes,
        data.id_vehiculos,
        data.id_infracciones,
      ]
    );
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const updateEXfiles = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
      "UPDATE expedientes SET\
       fecha_resolucion=$1,user_creador=$2,tipo_procedimiento=$3,empadronado=$4,inspector=$5,testigo=$6,\
       id_inspector=$7,id_leyes=$8,id_vehiculos=$9,id_infracciones=$10 WHERE id_expediente =$11 RETURNING *",
      [
        data.fecha_resolucion,
        data.user_creador,
        data.tipo_procedimiento,
        data.empadronado,
        data.inspector,
        data.testigo,

        data.id_inspector,

        data.id_leyes,
        data.id_vehiculos,
        data.id_infracciones,
        id,
      ]
    );
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const deleteExFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM expedientes WHERE id_expediente = $1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Expediente no existe" });
    }
    return res.status(204).json({ message: "Reporte eliminado" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con servidor" });
  }
};

const getInspectores = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM funcionarios WHERE rol_func='INSP'"
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen funcionarios" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

/*const getPatrulleros = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM funcionarios WHERE rol_func='PPRV'"
    ); // AGREGAR CONDICION DE ROL DE PATRULLEROS
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen funcionarios" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};*/

const getLeyes = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM leyes");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros de leyes" });
    }

    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con la base de datos" });
  }
};

const getVehInfrac = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM vehiculos_contri");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getVehiculoContri = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM vehiculos_contri WHERE id_vehiculos=$1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }

    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const createVehiInfra = async (req, res) => {
  try {
    const data = req.body;
    const { rows } = await pool.query(
      "INSERT INTO vehiculos_contri (tipo_vehi,marca_vehi,ppu,color_vehi) VALUES ($1,$2,$3,$4) RETURNING *",
      [data.tipo_vehi, data.marca_vehi, data.ppu, data.color_vehi]
    );
    return res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const updateVehiInfra = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
      "UPDATE vehiculos_contri SET tipo_vehi=$1,marca_vehi=$2,ppu=$3,color_vehi=$4 WHERE id_vehiculos=$5 RETURNING *",
      [data.tipo_vehi, data.marca_vehi, data.ppu, data.color_vehi, id]
    );
    return res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con servidor" });
  }
};

const deleteVehiInfra = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM vehiculos_contri WHERE id_vehiculos=$1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};
/*{
  "tipo_vehi": null,
  "marca_vehi": null,
  "ppu": null,
  "color_vehi": null,
  "id_vehiculos": 1
}*/

const getInfracciones = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM infracciones");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen infracciones" });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};
/*
{
		"id_infraccion": 1,
		"sector_infraccion": null,
		"direccion_infraccion": null,
		"fecha_citacion": null,
		"juzgado": null,
		"observaciones": null,
		"fecha_infraccion": null
	},
*/
const createInfraccion = async (req, res) => {
  try {
    const data = req.body;
    const { rows } = await pool.query(
      "INSERT INTO infracciones (sector_infraccion,direccion_infraccion,fecha_citacion,juzgado,observaciones,fecha_infraccion,id_expediente) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        data.sector_infraccion,
        data.direccion_infraccion,
        data.fecha_citacion,
        data.juzgado,
        data.observaciones,
        data.fecha_infraccion,
        data.id_expediente,
      ]
    );
    return res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con servidor" });
  }
};

const updateInfraccion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
      "UPDATE infracciones SET sector_infraccion=$1,direccion_infraccion=$2,fecha_citacion=$3,juzgado=$4,observaciones=$5,fecha_infraccion=$6, id_expediente=$7 WHERE id_infraccion=$8",
      [
        data.sector_infraccion,
        data.direccion_infraccion,
        data.fecha_citacion,
        data.juzgado,
        data.observaciones,
        data.fecha_infraccion,
        data.id_expediente,
        id,
      ]
    );
    return res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const deleteInfraccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM infracciones WHERE id_infraccion=$1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No hay registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getDatosVehi = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM datos_vehiculos");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getGlosaLey = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM glosas_ley");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const createExpediente = async (req, res) => {
  const client = await pool.connect();
  try {
    const data = req.body;

    await client.query("BEGIN");

    const { rows } = await client.query(
      "INSERT INTO expedientes(fecha_resolucion,user_creador,tipo_procedimiento,empadronado,inspector,testigo,id_inspector,id_leyes,id_glosas) \
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [
        data.fecha_resolucion,
        data.user_creador,
        data.tipo_procedimiento,
        data.empadronado,
        data.inspector,
        data.testigo,

        data.id_inspector,

        data.id_leyes,
        data.id_glosas,
      ]
    );
    const idExpediente = rows[0].id_expediente;
    const infra = await client.query(
      "INSERT INTO infracciones (sector_infraccion,direccion_infraccion,\
      fecha_citacion,juzgado,observaciones,fecha_infraccion,id_expediente) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        data.sector_infraccion,
        data.direccion_infraccion,
        data.fecha_citacion,
        data.juzgado,
        data.observaciones,
        data.fecha_infraccion,
        idExpediente,
      ]
    );
    const idInfraccion = infra.rows[0].id_infraccion;

    const contri = await client.query(
      "INSERT INTO contribuyentes (rut_contri,nombre,direccion,rol_contri,giro_contri,id_infraccion,id_expediente) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        data.rut_contri,
        data.nombre,
        data.direccion,
        data.rol_contri,
        data.giro_contri,
        idInfraccion,
        idExpediente,
      ]
    );
    const idContri = contri.rows[0].id_contri;
    console.log("id_contri", idContri);
    const vehiInfrac = await client.query(
      "INSERT INTO vehiculos_contri (tipo_vehi,marca_vehi,ppu,color_vehi,id_contri,id_expediente) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        data.tipo_vehi,
        data.marca_vehi,
        data.ppu,
        data.color_vehi,
        idContri,
        idExpediente,
      ]
    );

    await client.query("COMMIT");

    return res.json({
      expediente: rows[0],
      detalles: infra.rows[0],
      detallesVehiculo: vehiInfrac.rows[0],
      detalleContri: contri.rows[0],
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

const updateExpediente = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const data = req.body;
    await client.query("BEGIN");
    const { rows } = await client.query(
      "UPDATE expedientes SET fecha_resolucion=$1,user_creador=$2,tipo_procedimiento=$3,empadronado=$4,inspector=$5,testigo=$6,\
     id_inspector=$7,id_leyes=$8,id_glosas=$9 WHERE id_expediente =$10 RETURNING *",
      [
        data.fecha_resolucion,
        data.user_creador,
        data.tipo_procedimiento,
        data.empadronado,
        data.inspector,
        data.testigo,

        data.id_inspector,

        data.id_leyes,
        data.id_glosas,
        id,
      ]
    );

    const infrac = await client.query(
      "UPDATE infracciones SET sector_infraccion=$1,direccion_infraccion=$2,fecha_citacion=$3,juzgado=$4,observaciones=$5,fecha_infraccion=$6 WHERE id_expediente=$7 RETURNING *",
      [
        data.sector_infraccion,
        data.direccion_infraccion,
        data.fecha_citacion,
        data.juzgado,
        data.observaciones,
        data.fecha_infraccion,
        id,
      ]
    );

    const idInfraccion = infrac.rows[0].id_infraccion;
    console.log("id_infraccion", idInfraccion);

    const contriRows = await client.query(
      "UPDATE contribuyentes SET rut_contri=$1,nombre=$2,direccion=$3,rol_contri=$4,giro_contri=$5 WHERE id_infraccion=$6 RETURNING *",
      [
        data.rut_contri,
        data.nombre,
        data.direccion,
        data.rol_contri,
        data.giro_contri,
        idInfraccion,
      ]
    );

    const idContri = contriRows.rows[0].id_contri;
    console.log("id_contri", idContri);

    const vehiInfra = await client.query(
      "UPDATE vehiculos_contri SET tipo_vehi=$1,marca_vehi=$2,ppu=$3,color_vehi=$4 WHERE id_contri=$5 RETURNING *",
      [data.tipo_vehi, data.marca_vehi, data.ppu, data.color_vehi, idContri]
    );

    await client.query("COMMIT");

    return res.json({
      expediente: rows[0],
      detallesInfraccion: infrac.rows[0],
      contribuyente: contriRows.rows[0],
      detallesVehiculo: vehiInfra.rows[0],
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

const deleteExpediente = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");

    const deleteInfra = await client.query(
      "DELETE FROM infracciones WHERE id_expediente=$1 RETURNING *",
      [id]
    );

    const idInfrac = deleteInfra.rows.id_infraccion;

    console.log("id_infraccion", idInfrac);
    console.log(deleteInfra.rows[0]);

    const deleteContri = await client.query(
      "DELETE FROM public.contribuyentes WHERE id_expediente=$1 RETURNING *",
      [id]
    );

    console.log(deleteContri.rows[0]);
    const idContri = deleteContri.rows.id_contri;
    console.log("id_contri", idContri);

    const deleteVehiInfra = await client.query(
      "DELETE FROM vehiculos_contri WHERE id_expediente=$1 RETURNING *",
      [id]
    );

    const deleteImgAdjunta = await client.query(
      "DELETE FROM doc_adjuntos WHERE id_expediente=$1 RETURNING *",
      [id]
    );

    const { rows } = await client.query(
      "DELETE FROM expedientes WHERE id_expediente=$1 RETURNING *",
      [id]
    );

    console.log(rows[0]);
    await client.query("COMMIT");

    return res.json({
      delete: rows[0],
      deleteInfra: deleteInfra.rows[0],
      deleteContri: deleteContri.rows[0],
      deleteVehiculo: deleteVehiInfra.rows[0],
      deleteAdjunto: deleteImgAdjunta.rows[0],
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexion con servidor" });
  } finally {
    client.release();
  }
};

const getAllExpedientes = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM expedientes WHERE id_expediente=$1",
      [id]
    );

    const infrac = await client.query(
      "SELECT * FROM infracciones WHERE id_expediente=$1",
      [id]
    );

    const idInfraccion = infrac.rows[0].id_infraccion;
    console.log("id_infraccion", idInfraccion);

    const contriRows = await client.query(
      "SELECT * FROM contribuyentes WHERE id_infraccion=$1",
      [idInfraccion]
    );

    const idContri = contriRows.rows[0].id_contri;
    console.log("id_contri", idContri);

    const vehiInfra = await client.query(
      "SELECT * FROM vehiculos_contri WHERE id_contri=$1 ",
      [idContri]
    );

    await client.query("COMMIT");

    return res.json({
      expediente: rows[0],
      detallesInfraccion: infrac.rows[0],
      contribuyente: contriRows.rows[0],
      detallesVehiculo: vehiInfra.rows[0],
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

const getArchivosExp = async (req, res) => {
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

const findArchivosExp = async (id) => {
  try {
    //const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM doc_adjuntos WHERE id_expediente=($1)",
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

const findArchivosByIdExp = async (id) => {
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

const createArchivoExp = async (fileUrl, idExpediente) => {
  try {
    /*const data = req.body;*/
    const { rows } = await pool.query(
      "INSERT INTO doc_adjuntos (path_document,id_expediente) VALUES ($1,$2) RETURNING *",
      [fileUrl, idExpediente]
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

const deleteArchivoExp = async (req, res) => {
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

const getLastExpediente = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM expedientes ORDER BY id_exp DESC LIMIT 1"
    );

    const infrac = await client.query(
      "SELECT * FROM infracciones ORDER BY id_infraccion DESC LIMIT 1"
    );

    const contriRows = await client.query(
      "SELECT * FROM contribuyentes ORDER BY id_contri DESC LIMIT 1"
    );

    const vehiInfra = await client.query(
      "SELECT * FROM vehiculos_contri ORDER BY id_vehiculos DESC LIMIT 1"
    );

    await client.query("COMMIT");

    return res.json({
      expediente: rows[0],
      detallesInfraccion: infrac.rows[0],
      contribuyente: contriRows.rows[0],
      detallesVehiculo: vehiInfra.rows[0],
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

const getFirstExpediente = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM expedientes ORDER BY id_exp ASC LIMIT 1"
    );

    const infrac = await client.query(
      "SELECT * FROM infracciones ORDER BY id_infraccion ASC LIMIT 1"
    );

    const contriRows = await client.query(
      "SELECT * FROM contribuyentes ORDER BY id_contri ASC LIMIT 1"
    );

    const vehiInfra = await client.query(
      "SELECT * FROM vehiculos_contri ORDER BY id_vehiculos ASC LIMIT 1"
    );

    await client.query("COMMIT");

    return res.json({
      expediente: rows[0],
      detallesInfraccion: infrac.rows[0],
      contribuyente: contriRows.rows[0],
      detallesVehiculo: vehiInfra.rows[0],
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

const getPrevExpediente = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // 1. Obtener el expediente previo
    const { rows: expedienteRows } = await client.query(
      "SELECT * FROM expedientes WHERE id_exp < (SELECT id_exp FROM expedientes WHERE id_expediente = $1) ORDER BY id_exp DESC LIMIT 1",
      [id]
    );

    if (expedienteRows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "No se encontró expediente previo" });
    }

    const expediente = expedienteRows[0];

    // 2. Obtener la infracción relacionada al expediente
    const { rows: infracRows } = await client.query(
      "SELECT * FROM infracciones WHERE id_expediente = $1 ORDER BY id_infraccion DESC LIMIT 1",
      [expediente.id_expediente]
    );

    const infraccion = infracRows.length > 0 ? infracRows[0] : null;

    let contribuyente = null;
    let detallesVehiculo = null;

    // 3. Obtener el contribuyente relacionado
    if (infraccion) {
      const { rows: contriRows } = await client.query(
        "SELECT * FROM contribuyentes WHERE id_infraccion = $1 ORDER BY id_contri DESC LIMIT 1",
        [infraccion.id_infraccion]
      );

      contribuyente = contriRows.length > 0 ? contriRows[0] : null;
    }

    // 4. Obtener los detalles del vehículo
    if (contribuyente) {
      const { rows: vehiInfraRows } = await client.query(
        "SELECT * FROM vehiculos_contri WHERE id_contri = $1 ORDER BY id_contri DESC LIMIT 1",
        [contribuyente.id_contri]
      );

      detallesVehiculo = vehiInfraRows.length > 0 ? vehiInfraRows[0] : null;
    }

    await client.query("COMMIT");

    return res.json({
      expediente,
      detallesInfraccion: infraccion,
      contribuyente,
      detallesVehiculo,
    });
  } catch (error) {
    console.error("Error en getPrevExpediente:", error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getNextExpediente = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // 1. Obtener el expediente previo
    const { rows: expedienteRows } = await client.query(
      "SELECT * FROM expedientes WHERE id_exp > (SELECT id_exp FROM expedientes WHERE id_expediente = $1) ORDER BY id_exp ASC LIMIT 1",
      [id]
    );

    if (expedienteRows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "No se encontró expediente previo" });
    }

    const expediente = expedienteRows[0];

    // 2. Obtener la infracción relacionada al expediente
    const { rows: infracRows } = await client.query(
      "SELECT * FROM infracciones WHERE id_expediente = $1 ORDER BY id_infraccion ASC LIMIT 1",
      [expediente.id_expediente]
    );

    const infraccion = infracRows.length > 0 ? infracRows[0] : null;

    let contribuyente = null;
    let detallesVehiculo = null;

    // 3. Obtener el contribuyente relacionado
    if (infraccion) {
      const { rows: contriRows } = await client.query(
        "SELECT * FROM contribuyentes WHERE id_infraccion = $1 ORDER BY id_contri ASC LIMIT 1",
        [infraccion.id_infraccion]
      );

      contribuyente = contriRows.length > 0 ? contriRows[0] : null;
    }

    // 4. Obtener los detalles del vehículo
    if (contribuyente) {
      const { rows: vehiInfraRows } = await client.query(
        "SELECT * FROM vehiculos_contri WHERE id_contri = $1 ORDER BY id_contri ASC LIMIT 1",
        [contribuyente.id_contri]
      );

      detallesVehiculo = vehiInfraRows.length > 0 ? vehiInfraRows[0] : null;
    }

    await client.query("COMMIT");

    return res.json({
      expediente,
      detallesInfraccion: infraccion,
      contribuyente,
      detallesVehiculo,
    });
  } catch (error) {
    console.error("Error en getPrevExpediente:", error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const searchInformeInspeccion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.query;

    await client.query("BEGIN");

    const expediente = await client.query(
      "SELECT expe.*, inf.* as infracciones,\
        contri.* as contribuyentes, vehi.* as vehiculos_contri\
        FROM expedientes expe\
        LEFT JOIN infracciones inf on expe.id_expediente = inf.id_expediente\
        LEFT JOIN contribuyentes contri on expe.id_expediente = contri.id_expediente\
        LEFT JOIN vehiculos_contri vehi on expe.id_expediente = vehi.id_expediente\
        WHERE expe.id_expediente = $1",
      [id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      expedientes: expediente.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

const searchExpedientes = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rut, ppu } = req.query;

    await client.query("BEGIN");
    let whereClauses = [];
    let values = [];

    if (rut) {
      whereClauses.push("contri.rut_contri = $" + (values.length + 1));
      values.push(rut);
    }

    if (ppu) {
      whereClauses.push("vehi.ppu = $" + (values.length + 1));
      values.push(ppu);
    }

    const whereSQL =
      whereClauses.length > 0 ? "WHERE " + whereClauses.join(" OR ") : "";

    const expediente = await client.query(
      `SELECT expe.*, inf.* as infracciones,
              contri.* as contribuyentes, vehi.* as vehiculos_contri
       FROM expedientes expe
       LEFT JOIN infracciones inf on expe.id_expediente = inf.id_expediente
       LEFT JOIN contribuyentes contri on expe.id_expediente = contri.id_expediente
       LEFT JOIN vehiculos_contri vehi on expe.id_expediente = vehi.id_expediente
       ${whereSQL}`,
      values
    );

    await client.query("COMMIT");

    return res.status(200).json({
      expedientes: expediente.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

const getImgExpedientes = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const imgExped = await client.query(
      "SELECT * FROM doc_adjuntos WHERE id_expediente IS NOT NULL LIMIT 1"
    );
    if (imgExped.rows.length === 0) {
      return res.status(404).json({ message: "No se encuentran registros" });
    }
    await client.query("COMMIT");
    return res.status(200).json({
      imgExpedientes: imgExped.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  } finally {
    client.release();
  }
};

export {
  getExpedientes,
  getExpediente,
  createEXfiles,
  updateEXfiles,
  deleteExFile,
  getInspectores,
  getLeyes,
  getVehInfrac,
  createVehiInfra,
  updateVehiInfra,
  deleteVehiInfra,
  getInfracciones,
  createInfraccion,
  updateInfraccion,
  deleteInfraccion,
  getDatosVehi,
  getVehiculoContri,
  createExpediente,
  updateExpediente,
  deleteExpediente,
  getGlosaLey,
  getAllExpedientes,
  getArchivosExp,
  findArchivosExp,
  createArchivoExp,
  deleteArchivoExp,
  findArchivosByIdExp,
  getLastExpediente,
  getFirstExpediente,
  getPrevExpediente,
  getNextExpediente,
  searchInformeInspeccion,
  searchExpedientes,
  getImgExpedientes,
};
