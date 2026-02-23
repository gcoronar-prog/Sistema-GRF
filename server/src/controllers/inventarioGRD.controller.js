import { pool } from "../db.js";

const getInventario = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM inventario_grd");
  return res.json(rows);
};

const getInventarios = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const [inventario, prestamo] = await Promise.all([
      client.query("SELECT * FROM inventario_grd"),
      client.query("SELECT * FROM prestamo_grd"),
    ]);
    await client.query("COMMIT");

    console.log(inventario, prestamo);
    return res.json({
      inventarioGRD: inventario.rows,
      prestamo: prestamo.rows,
    });
  } catch (error) {
    console.error("Error obteniendo inventario", error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

const getInventarioGRD = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventario_grd WHERE id_producto=$1",
      [id],
    );
    if (rows.length === 0) {
      console.error("No existen registros");
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getListaProductos = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM productos_grd");
    if (rows.length === 0) {
      console.error("No existen registros");
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
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
      ],
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
      ],
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
      ],
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
      ],
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
      [id],
    );
    const idProductGRD = inventario.rows[0].cod_producto;
    const producto = await client.query(
      "DELETE FROM productos_grd WHERE cod_producto=$1 RETURNING *",
      [idProductGRD],
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
      "SELECT * FROM inventario_grd ORDER BY id_producto DESC LIMIT 1",
    );
    const producto = await client.query(
      "SELECT * FROM prestamo_grd ORDER BY id_prestamo DESC LIMIT 1",
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
      "SELECT * FROM inventario_grd ORDER BY id_producto ASC LIMIT 1",
    );
    const producto = await client.query(
      "SELECT * FROM productos_grd ORDER BY id_productos_grd ASC LIMIT 1",
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
      [id],
    );
    const codProducto = prevInventario.rows[0].cod_producto;

    const prevProducto = await client.query(
      "SELECT * FROM productos_grd WHERE id_productos_grd <\
        (SELECT id_productos_grd FROM productos_grd WHERE cod_producto=$1)\
	    ORDER BY id_productos_grd DESC LIMIT 1",
      [codProducto],
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
      [id],
    );
    const codProducto = nextInventario.rows[0].cod_producto;
    console.log(codProducto);
    const nextProducto = await client.query(
      "SELECT * FROM productos_grd WHERE id_productos_grd >\
      (SELECT id_productos_grd FROM productos_grd WHERE cod_producto=$1)\
	    ORDER BY id_productos_grd asc LIMIT 1",
      [codProducto],
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

const entrada_grd = `
  INSERT INTO inventario_grd (ubicacion,observaciones,usuario_creador,fecha_creado,\
  marca,modelo,cantidad,tipo_producto,factura,orden_compra,proveedor,producto,\
  precio_unitario,precio_total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *;
`;

const nuevo_producto = `
  INSERT INTO productos_grd (nombre_producto, observ_produ, tipo_produ,\
  cantidad, precio_unit, precio_total, ubicacion) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;`;

const nuevo_prestamo = `INSERT INTO prestamo_grd (nombre,marca,modelo,serial,cantidad,user_prestamo) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`;

const nueva_salida = `INSERT INTO salida_inventario_grd (fecha_salida, estado_salida,direccion_salida,\
sector_salida,tipo_ubi_salida,descripcion_salida,tipo_evento,responsable_salida,user_form,observaciones) \
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`;

const update_entrada = `
  UPDATE inventario_grd SET ubicacion=$1,observaciones=$2,usuario_creador=$3,fecha_creado=$4,\
  marca=$5,modelo=$6,cantidad=$7,tipo_producto=$8,factura=$9,orden_compra=$10,proveedor=$11,producto=$12,\
  precio_unitario=$13,precio_total=$14 WHERE id_producto = $15 RETURNING *;
`;

const update_producto = `
  UPDATE productos_grd SET nombre_producto=$1, observ_produ=$2, tipo_produ=$3,\
  cantidad=$4, precio_unit=$5, precio_total=$6, ubicacion=$7 WHERE id_productos_grd = $8 RETURNING *;
`;

const update_prestamo = `
  UPDATE prestamo_grd SET nombre=$1,marca=$2,modelo=$3,serial=$4,cantidad=$5,user_prestamo=$6\
  WHERE id_prestamo = $7 RETURNING *;
`;

const update_salida = `
  UPDATE salida_inventario_grd SET fecha_salida=$1, estado_salida=$2,direccion_salida=$3,\
  sector_salida=$4,tipo_ubi_salida=$5,descripcion_salida=$6,tipo_evento=$7,responsable_salida=$8,\
  user_form=$9,observaciones=$10 WHERE id_salida = $11 RETURNING *;
`;

const delete_entrada = `DELETE FROM inventario_grd WHERE id_producto=$1 RETURNING *;`;

const delete_producto = `DELETE FROM productos_grd WHERE id_productos_grd=$1 RETURNING *;`;

const delete_prestamo = `DELETE FROM prestamo_grd WHERE id_prestamo=$1 RETURNING *;`;

const delete_salida = `DELETE FROM salida_inventario_grd WHERE id_salida=$1 RETURNING *;`;

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
  getListaProductos,
};
