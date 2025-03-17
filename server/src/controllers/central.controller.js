import path from "path";
import { pool } from "../db.js";
import fs from "fs";

const getReports = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM central");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen reportes" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error de conexion con el servidor" });
  }
};

const getRecursos = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM datos_recursos_informe");
    if (rows.length === 0) {
      return res.json(404).json({ msg: "No existen recursos" });
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error de conexión con el servidor" });
  }
};

const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM central WHERE id_reporte=$1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error de conexion con el servidor" });
  }
};

const createReport = async (req, res) => {
  try {
    const data = req.body;
    const { rows } = await pool.query(
      "INSERT INTO central (fecha_ocurrencia,estado,fuente_captura,origen_captura,clasificacion,desc_reporte,vehiculo,acompanante, recursos, otro_recurso, id_informante,id_sector,id_funcionario, direccion,coordenadas,id_tipo_reporte,id_origen) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *",
      [
        data.fecha_ocurrencia,
        data.estado,
        data.fuente_captura,
        data.origen_captura,
        data.clasificacion,
        data.desc_reporte,
        data.vehiculo,
        data.acompanante,
        data.recursos,
        data.otro_recurso,
        data.id_informante,
        data.id_sector,
        data.id_funcionario,
        data.direccion,
        data.coordenadas,
        data.id_tipo_reporte,
        data.id_origen,
      ]
    );
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error de conexion con el servidor" });
  }
};

const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
      "UPDATE central SET fecha_ocurrencia=$1,estado=$2,fuente_captura=$3,origen_captura=$4,clasificacion=$5,desc_reporte=$6,vehiculo=$7,acompanante=$8, recursos=$9, otro_recurso=$10, id_informante=$11,id_sector=$12,id_funcionario=$13, direccion=$14,coordenadas=$15,id_tipo_reporte=$16,id_origen=$17 WHERE id_reporte = $18 RETURNING *",
      [
        data.fecha_ocurrencia,
        data.estado,
        data.fuente_captura,
        data.origen_captura,
        data.clasificacion,
        data.desc_reporte,
        data.vehiculo,
        data.acompanante,
        data.recursos,
        data.otro_recurso,
        data.id_informante,
        data.id_sector,
        data.id_funcionario,
        data.direccion,
        data.coordenadas,
        data.id_tipo_reporte,
        data.id_origen,
        id,
      ]
    );
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error de conexion con el servidor" });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM central WHERE id_reporte = $1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    return res.status(204).json({ message: "Reporte eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error de conexion con el servidor" });
  }
};

const getChoferes = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * from funcionarios WHERE chofer=true"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getInformantes = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM informantes");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getVehiculos = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query("SELECT * FROM vehiculos");
    if (rows.length === 0) {
      await client.query("COMMIT");
      return res.status(404).json({ message: "No existen registros" });
    }
    await client.query("COMMIT");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getTipoReportes = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tipo_reportes");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getTipoReporte = async (req, res) => {
  const { grupo } = req.query;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM tipo_reportes WHERE grupo_reporte = $1",
      [grupo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getFuncionarios = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM funcionarios");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getOrigenes = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM origenes");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getTripulantes = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM funcionarios WHERE chofer=false"
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getSectores = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM sectores");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existen registros" });
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error de conexión con el servidor" });
  }
};

const getLastReport = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM central ORDER BY id_reporte DESC LIMIT 1"
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encuentran registros" });
    }
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error de conexion con el servidor" });
  }
};

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

export {
  getReports,
  getReport,
  getRecursos,
  createReport,
  updateReport,
  deleteReport,
  getChoferes,
  getInformantes,
  getVehiculos,
  getTipoReporte,
  getTipoReportes,
  getFuncionarios,
  getOrigenes,
  getTripulantes,
  getSectores,
  getLastReport,
  getArchivos,
  findArchivos,
  createArchivo,
  deleteArchivo,
  findArchivosById,
};
