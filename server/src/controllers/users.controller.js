import { pool } from "../db.js";

const getUsersCentral = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const users = await client.query(
      "SELECT id_user,cod_user,user_name,nombre,apellido FROM users_system WHERE user_rol='usercentral' order by user_name ASC"
    );
    await client.query("COMMIT");
    return res.status(200).json(users.rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

const getUsersInspect = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const users = await client.query(
      "SELECT id_user,cod_user,user_name,nombre,apellido FROM users_system WHERE user_rol='userinspeccion' order by user_name ASC"
    );
    await client.query("COMMIT");
    return res.status(200).json(users.rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

export { getUsersCentral, getUsersInspect };
