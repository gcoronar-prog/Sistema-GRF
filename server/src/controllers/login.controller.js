import { pool } from "../db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const getUsers = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const usuarios = await client.query("SELECT * FROM users_system");
    await client.query("COMMIT");
    return res.status(200).json({ usuarios: usuarios.rows });
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
    return res.status(200).json({ usuarios: usuarios.rows });
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
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(data.user_password, salt);
  try {
    await client.query("BEGIN");
    const usuarios = await client.query(
      "INSERT INTO users_system (cod_user,user_name,user_password,nombre,apellido,user_rol)\
        VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        data.cod_user,
        data.user_name,
        hashedPassword,
        data.nombre,
        data.apellido,
        data.user_rol,
      ]
    );
    await client.query("COMMIT");
    return res.status(200).json({ usuario: usuarios.rows });
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
    return res.status(200).json({ usuario: usuarios.rows });
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

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const servidor = "http://localhost:5173";
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetLink = `${servidor}/sgf/reset-password/${token}`;

  console.log("Enlace de restablecimiento:", resetLink);

  return res.json({ msg: "Token generado", token });
};

const realResetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    const hashedPassword = await bcryptjs.hash(password, 10);
    await pool.query(
      "UPDATE users_system SET user_password = $1 WHERE id_user = $2",
      [hashedPassword, id]
    );

    res.json({ msg: "Contraseña actualizada" });
  } catch (error) {
    console.error("Error de token:", error);
    res.status(400).json({ msg: "Token inválido o expirado" });
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

const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({ msg: "Complete usuario y contraseña" });
    }

    const usuario = await pool.query(
      "SELECT * FROM users_system WHERE user_name=$1",
      [user_name]
    );

    const isMatch = await bcryptjs.compare(
      password,
      usuario.rows[0].user_password
    );

    const payload = {
      user_name: usuario.rows[0].user_name,
      user_rol: usuario.rows[0].user_rol,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2m",
    });

    if (!isMatch) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos" });
    }
    return res.status(200).json({ msg: token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Problemas de conexión con el servidor" });
  }
};

const profile = async (req, res) => {
  try {
    const usuario = req.user;
    const users = await pool.query(
      "SELECT * FROM users_system WHERE user_name=$1",
      [usuario]
    );

    return res.status(200).json({ ok: true, msg: users.rows });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Problemas de conexión con el servidor" });
  }
};

export {
  getUser,
  createUser,
  updateUser,
  deleteuser,
  login,
  profile,
  getUsers,
  resetPassword,
  realResetPassword,
};
