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
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const createProducto = async (req, res) => {
  const data = req.body;
  try {
    const { rows: result } = await pool.query(nuevo_producto, [
      data.nombre_producto,
      data.observ_produ,
      data.tipo_produ,
      data.cantidad,
      data.precio_unit,
      data.precio_total,
      data.ubicacion,
    ]);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexion con servidor" });
  }
};

const updateInventario = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const { rows: result } = await pool.query(update_producto, [
      data.nombre_producto,
      data.observ_produ,
      data.tipo_produ,
      data.cantidad,
      data.precio_unit,
      data.precio_total,
      data.ubicacion,
      id,
    ]);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const deleteInventario = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: result } = await pool.query(delete_producto, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encuentra el producto" });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getListEntradas = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM inventario_grd");
    if (rows.length === 0) {
      console.error("No existen registros");
    }
    return res.status(201).json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getEntrada = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventario_grd WHERE id_producto=$1",
      [id],
    );
    if (rows.length === 0) {
      console.error("No existen registros");
    }
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const createEntrada = async (req, res) => {
  const data = req.body;
  try {
    const { rows: result } = await pool.query(entrada_grd, [
      data.ubicacion,
      data.observaciones,
      data.usuario_creador,
      data.fecha_creado,
      data.marca,
      data.modelo,
      data.cantidad,
      data.tipo_producto,
      data.factura,
      data.orden_compra,
      data.proveedor,
      data.id_producto,
    ]);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexion con servidor" });
  }
};

const updateEntrada = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const { rows: result } = await pool.query(update_entrada, [
      data.ubicacion,
      data.observaciones,
      data.usuario_creador,
      data.fecha_creado,
      data.marca,
      data.modelo,
      data.cantidad,
      data.tipo_producto,
      data.factura,
      data.orden_compra,
      data.proveedor,
      data.producto,
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encuentra el producto" });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexion con servidor" });
  }
};

const deleteEntrada = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(delete_entrada, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encuentra el producto" });
    }
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexion con servidor" });
  }
};

// PRESTAMOS
const getListPrestamos = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM prestamo_grd");
    if (rows.length === 0) {
      console.error("No existen registros");
    }
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getPrestamo = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: result } = await pool.query(
      "SELECT * FROM prestamo_grd WHERE id_prestamo=$1",
      [id],
    );
    if (result.length === 0) {
      console.error("No existen registros");
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const createPrestamo = async (req, res) => {
  const data = req.body;
  try {
    const { rows: result } = await pool.query(nuevo_prestamo, [
      data.nombre,
      data.marca,
      data.modelo,
      data.serial,
      data.cantidad,
      data.user_prestamo,
    ]);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const updatePrestamo = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const { rows: result } = await pool.query(update_prestamo, [
      data.nombre,
      data.marca,
      data.modelo,
      data.serial,
      data.cantidad,
      data.user_prestamo,
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encuentra el producto" });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const deletePrestamo = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(delete_prestamo, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encuentra el producto" });
    }
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

//SALIDAS INVENTARIO

const getListSalidas = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM salida_inventario_grd");
    if (rows.length === 0) {
      console.error("No existen registros");
    }
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const getSalida = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM salida_inventario_grd WHERE id_salida=$1",
      [id],
    );
    if (rows.length === 0) {
      console.error("No existen registros");
    }
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const createSalida = async (req, res) => {
  const data = req.body;
  try {
    const { rows: result } = await pool.query(nueva_salida, [
      data.fecha_salida,
      data.estado_salida,
      data.direccion_salida,
      data.sector_salida,
      data.tipo_ubi_salida,
      data.descripcion_salida,
      data.tipo_evento,
      data.responsable_salida,
      data.user_form,
      data.observaciones,
    ]);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const updateSalida = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const { rows: result } = await pool.query(update_salida, [
      data.fecha_salida,
      data.estado_salida,
      data.direccion_salida,
      data.sector_salida,
      data.tipo_ubi_salida,
      data.descripcion_salida,
      data.tipo_evento,
      data.responsable_salida,
      data.user_form,
      data.observaciones,
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encuentra el producto" });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};

const deleteSalida = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(delete_salida, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encuentra el producto" });
    }
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Problemas de conexión con el servidor" });
  }
};
const entrada_grd = `
  INSERT INTO inventario_grd (ubicacion,observaciones,usuario_creador,fecha_creado,\
  marca,modelo,cantidad,tipo_producto,factura,orden_compra,proveedor,id_producto)\
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *

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
   WHERE id_inventario = $13 RETURNING *;
`;

const update_producto = `
  UPDATE productos_grd SET nombre_producto=$1, observ_produ=$2, tipo_produ=$3,\
  cantidad=$4, precio_unit=$5, precio_total=$6, ubicacion=$7 WHERE id_producto = $8 RETURNING *;
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

const delete_entrada = `DELETE FROM inventario_grd WHERE id_inventario=$1 RETURNING *;`;

const delete_producto = `DELETE FROM productos_grd WHERE id_producto=$1 RETURNING *;`;

const delete_prestamo = `DELETE FROM prestamo_grd WHERE id_prestamo=$1 RETURNING *;`;

const delete_salida = `DELETE FROM salida_inventario_grd WHERE id_salida=$1 RETURNING *;`;

export {
  getInventario,
  getInventarios,
  getInventarioGRD,
  createProducto,
  updateInventario,
  deleteInventario,
  getListaProductos,
  getListEntradas,
  getEntrada,
  createEntrada,
  updateEntrada,
  deleteEntrada,
  getListPrestamos,
  getPrestamo,
  createPrestamo,
  updatePrestamo,
  deletePrestamo,
  getListSalidas,
  getSalida,
  createSalida,
  updateSalida,
  deleteSalida,
};
