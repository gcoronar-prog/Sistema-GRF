import { pool } from "../db.js";

const getInventario = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM inventario_grd");
  return res.json(rows);
};

const getInventarios = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const [inventario, productos] = await Promise.all([
      client.query("SELECT * FROM inventario_grd"),
      client.query("SELECT * FROM productos_grd"),
    ]);
    await client.query("COMMIT");

    return res.json({
      inventarioGRD: inventario.rows,
      producto: productos.rows,
    });
  } catch (error) {
    console.error("Error obteniendo inventario", error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

const getInventarioGRD = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    await client.query("BEGIN");
    const inventario = await client.query(
      "SELECT * FROM inventario_grd WHERE id_producto=$1",
      [id]
    );
    const codPro = inventario.rows[0].cod_producto;

    const produ = await client.query(
      "SELECT * FROM productos_grd WHERE cod_producto=$1",
      [codPro]
    );
    await client.query("COMMIT");
    return res.json({
      inv: inventario.rows,
      prod: produ.rows,
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

const createProducto = async (req, res) => {
  const client = await pool.connect();
  const data = req.body;
  try {
    await client.query("BEGIN");

    const inventario = await client.query(
      "INSERT INTO inventario_grd \
                (ubicacion,observaciones,usuario_creador,fecha_creado,prestamo,usuario_prestamo)\
                VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        data.ubicacion,
        data.observaciones,
        data.usuario_creador,
        data.fecha_creado,
        data.prestamo,
        data.usuario_prestamo,
      ]
    );
    const idProducto = inventario.rows[0].cod_producto;

    const producto = await client.query(
      "INSERT INTO productos_grd \
          (marca,modelo,serial,desc_producto,unidad_medida,existencias,cod_producto,precio_unitario)\
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        data.marca,
        data.modelo,
        data.serial,
        data.desc_producto,
        data.unidad_medida,
        data.existencias,
        idProducto,
        data.precio_unitario,
      ]
    );

    await client.query("COMMIT");

    return res.json({
      registro_producto: producto.rows,
      registro_inventario: inventario.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexion con servidor" });
  } finally {
    client.release();
  }
};

const updateInventario = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const data = req.body;
    await client.query("BEGIN");

    const inven = await client.query(
      "UPDATE inventario_grd SET\
                ubicacion=$1,observaciones=$2, id_productos_grd=$3, prestamo=$4,usuario_prestamo=$5\
                WHERE id_producto = $6 RETURNING *",
      [
        data.ubicacion,
        data.observaciones,
        data.id_productos_grd,
        data.prestamo,
        data.usuario_prestamo,
        id,
      ]
    );
    const idProductGRD = inven.rows[0].cod_producto;

    const produc = await client.query(
      "UPDATE productos_grd SET\
        marca=$1,modelo=$2,serial=$3,desc_producto=$4,unidad_medida=$5,existencias=$6,precio_unitario=$7,precio_total=$8\
        WHERE cod_producto = $9  RETURNING *",
      [
        data.marca,
        data.modelo,
        data.serial,
        data.desc_producto,
        data.unidad_medida,
        data.existencias,
        data.precio_unitario,
        data.precio_total,
        idProductGRD,
      ]
    );
    await client.query("COMMIT");

    return res.json({
      inventario: inven.rows,
      productos: produc.rows,
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

const deleteInventario = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const inventario = await client.query(
      "DELETE FROM inventario_grd WHERE id_producto=$1 RETURNING *",
      [id]
    );
    const idProductGRD = inventario.rows[0].cod_producto;
    const producto = await client.query(
      "DELETE FROM productos_grd WHERE cod_producto=$1 RETURNING *",
      [idProductGRD]
    );
    await client.query("COMMIT");

    return res.json({
      inventarioDelete: inventario.rows,
      productoDelete: producto.rows,
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

const getLastInventario = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const inventario = await client.query(
      "SELECT * FROM inventario_grd ORDER BY id_producto DESC LIMIT 1"
    );
    const producto = await client.query(
      "SELECT * FROM productos_grd ORDER BY id_productos_grd DESC LIMIT 1"
    );
    await client.query("COMMIT");

    return res.json({
      ultimo: inventario.rows,
      ultimo_producto: producto.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.json({ message: "Problemas de conexion con el servidor" });
  } finally {
    client.release();
  }
};

const getFirstInventario = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const inventario = await client.query(
      "SELECT * FROM inventario_grd ORDER BY id_producto ASC LIMIT 1"
    );
    const producto = await client.query(
      "SELECT * FROM productos_grd ORDER BY id_productos_grd ASC LIMIT 1"
    );
    await client.query("COMMIT");

    return res.json({
      primero: inventario.rows,
      primer_producto: producto.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.json({ message: "Problemas de conexion con el servidor" });
  } finally {
    client.release();
  }
};

const getPrevInventario = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const prevInventario = await client.query(
      "SELECT * FROM inventario_grd WHERE id_producto < \
        (SELECT id_producto FROM inventario_grd WHERE id_producto=$1) ORDER BY id_producto DESC LIMIT 1",
      [id]
    );
    const codProducto = prevInventario.rows[0].cod_producto;

    const prevProducto = await client.query(
      "SELECT * FROM productos_grd WHERE id_productos_grd <\
        (SELECT id_productos_grd FROM productos_grd WHERE cod_producto=$1)\
	    ORDER BY id_productos_grd DESC LIMIT 1",
      [codProducto]
    );

    if (prevInventario.length === 0 && prevProducto === 0) {
      return res
        .status(404)
        .json({ message: "No se encuentran registros anteriores" });
    }
    await client.query("COMMIT");
    return res.json({
      inventario_prev: prevInventario.rows,
      productos_prev: prevProducto.rows,
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

const getNextInventario = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const nextInventario = await client.query(
      "SELECT * FROM inventario_grd WHERE id_producto > \
          (SELECT id_producto FROM inventario_grd WHERE id_producto=$1) ORDER BY id_producto ASC LIMIT 1",
      [id]
    );
    const codProducto = nextInventario.rows[0].cod_producto;
    console.log(codProducto);
    const nextProducto = await client.query(
      "SELECT * FROM productos_grd WHERE id_productos_grd >\
      (SELECT id_productos_grd FROM productos_grd WHERE cod_producto=$1)\
	    ORDER BY id_productos_grd asc LIMIT 1",
      [codProducto]
    );

    if (nextInventario.length === 0 || nextProducto.length === 0) {
      return res.status(404).json({ message: "No se encuentran registros" });
    }
    await client.query("COMMIT");
    return res.json({
      inventario_next: nextInventario.rows,
      productos_next: nextProducto.rows,
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

export {
  getInventario,
  getInventarios,
  getInventarioGRD,
  createProducto,
  updateInventario,
  deleteInventario,
  getLastInventario,
  getFirstInventario,
  getPrevInventario,
  getNextInventario,
};
