import path from "path";
import { pool } from "../db.js";

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
      "SELECT * FROM doc_adjuntos WHERE id_formulario=($1)",
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

const createArchivo = async (fileUrl, idAtencion) => {
  try {
    console.log("id atencion: ", idAtencion);
    const { rows } = await pool.query(
      "INSERT INTO doc_adjuntos (path_document,id_formulario) VALUES ($1,$2) RETURNING *",
      [fileUrl, idAtencion]
    );
    return rows[0];
  } catch (error) {
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
  getArchivos,
  findArchivos,
  findArchivosById,
  createArchivo,
  deleteArchivo,
};
