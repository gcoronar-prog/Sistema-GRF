import { pool } from "../db.js";

const getUsers = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const usuarios = await client.query("SELECT * FROM users_system");
    await client.query("COMMIT");
    return res.json({ usuarios: usuarios.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res
      .status(500)
      .json({ error: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const getUser = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  try {
    await client.query("BEGIN");
    const usuarios = await client.query(
      "SELECT * FROM users_system WHERE id_user=$1",
      [id]
    );
    await client.query("COMMIT");
    return res.json({ usuarios: usuarios.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res
      .status(500)
      .json({ error: "Problemas de conexión con el servidor" });
  } finally {
    client.release();
  }
};

const createUser = async (req, res) => {
  const client = await pool.connect();
  const data = req.body;
  try {
    await client.query("BEGIN");
    const usuarios = await client.query(
      "INSERT INTO users_system (cod_user,user_name,user_password,nombre,apellido,user_rol)\
        VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        data.cod_user,
        data.user_name,
        data.user_password,
        data.nombre,
        data.apellido,
        data.user_rol,
      ]
    );
    await client.query("COMMIT");
    return res.json({ usuario: usuarios.rows });
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

const updateUser = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  const data = req.body;
  try {
    await client.query("BEGIN");
    const usuarios = await client.query(
      "UPDATE users_system SET cod_user=$1,user_name=$2,user_password=$3,\
      nombre=$4,apellido=$5,user_rol=$6 WHERE id_user=$7 RETURNING *",
      [
        data.cod_user,
        data.user_name,
        data.user_password,
        data.nombre,
        data.apellido,
        data.user_rol,
        id,
      ]
    );
    await client.query("COMMIT");
    return res.json({ usuario: usuarios.rows });
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

const deleteuser = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    await client.query("BEGIN");
    const usuario = await client.query(
      "DELETE FROM users_system WHERE id_user=$1 RETURNING *",
      [id]
    );
    await client.query("COMMIT");
    return res.json({ usuario: usuario.rows });
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

export { getUser, createUser, updateUser, deleteuser };
