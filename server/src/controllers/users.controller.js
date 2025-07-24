import { pool } from "../db.js";

const getUsers = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const users = await client.query(
      "SELECT id_user,cod_user,user_name,nombre,apellido FROM users_system"
    );
    await client.query("COMMIT");
    return res.status(200).json(users.rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

export { getUsers };
