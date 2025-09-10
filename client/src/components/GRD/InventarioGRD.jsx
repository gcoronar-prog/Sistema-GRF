import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InventarioGRD() {
  const navigate = useNavigate();
  const params = useParams();
  const defaultInventario = {
    cod_producto: "",
    ubicacion: "",
    observaciones: "",
    usuario_creador: "",
    fecha_creado: "",
    prestamo: "",
    usuario_prestamo: "",

    id_productos_grd: "",
    marca: "",
    modelo: "",
    serial: "",
    desc_producto: "",
    unidad_medida: "",
    existencias: "",
    precio_unitario: "",
    precio_total: "",
  };
  const [inventarios, setInventarios] = useState({ defaultInventario });
  const [editing, setEditing] = useState(true);
  const [disabledPrevButton, setDisabledPrevButton] = useState(false);
  const [disabledNextButton, setDisabledNextButton] = useState(false);
  const [lastIdInventario, setLastIdInventario] = useState(null);

  useEffect(() => {
    if (params.id) {
      loadInventario(params.id);
    } else {
      setInventarios(defaultInventario);
    }
  }, [params.id]);

  const loadInventario = async (id) => {
    //console.log(id);
    const res = await fetch(`${servidor}/inventario/grd/${id}`);
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();

    const formattedFecha = dayjs(data.inv[0].fecha_creado).format(
      "YYYY-MM-DDTHH:mm"
    );
    console.log(formattedFecha);
    console.log(data.inv[0].formattedFecha);
    setInventarios({
      id_producto: data.inv[0].id_producto,
      cod_producto: data.inv[0].cod_producto,
      ubicacion: data.inv[0].ubicacion,
      observaciones: data.inv[0].observaciones,
      usuario_creador: data.inv[0].usuario_creador,
      //fecha_creado: formattedFecha,
      fecha_creado: formattedFecha,
      prestamo: data.inv[0].prestamo,
      usuario_prestamo: data.inv[0].usuario_prestamo,

      id_productos_grd: data.prod[0].id_productos_grd,
      marca: data.prod[0].marca,
      modelo: data.prod[0].modelo,
      serial: data.prod[0].serial,
      desc_producto: data.prod[0].desc_producto,
      unidad_medida: data.prod[0].unidad_medida,
      existencias: data.prod[0].existencias,
      precio_unitario: data.prod[0].precio_unitario,
      precio_total: data.prod[0].precio_total,
    });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setInventarios({ ...inventarios, [name]: value });
  };

  const handleEdit = async () => {
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados", inventarios.fecha_creado);

    try {
      const url = params.id
        ? `${servidor}/inventario/grd/${params.id}/edit`
        : `${servidor}/inventario/new`;

      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventarios),
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await res.json();

      const lastInventarioRes = await fetch(`${servidor}/inventario/last/grd`);
      const lastInventarioData = await lastInventarioRes.json();
      setLastIdInventario(lastInventarioData.ultimo[0].id_producto);

      // Si obtuvimos el último inventario, redirigimos a su página de edición
      if (lastInventarioData && lastInventarioData.ultimo[0]) {
        const lastId = lastInventarioData.ultimo[0].id_producto;
        navigate(`/grd/inventario/${lastIdInventario + 1}/edit`);
      }

      const metodo = params.id
        ? ""
        : `/grd/inventario/${lastIdInventario}/edit`;
      navigate(metodo);
      setEditing(true);

      setDisabledPrevButton(false);
    } catch (error) {
      //console.error("Error en handleSubmit:", error.message);
      console.error(error);
    }
    setEditing(true);
  };

  const handleNewInventario = () => {
    navigate("/grd/inventario/new");
    //setInventarios(defaultInventario);
    setEditing(false);
  };

  const handleCancel = async () => {
    const id = params.id;

    try {
      const res = await fetch(`${servidor}/inventario/last/grd`);

      if (!id) {
        if (res.ok) {
          const lastInventario = await res.json();
          if (lastInventario) {
            navigate(
              `/grd/inventario/${lastInventario.ultimo[0].id_producto}/edit`
            );
            console.log("ultima id", lastInventario.ultimo[0].id_producto);
          }
        }
      }

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
  };

  const handleDeleteInventario = async () => {
    const id = params.id;

    await fetch(`${servidor}/inventario/grd/${id}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updateInventario = { ...inventarios };
    delete updateInventario[id];
    setInventarios(updateInventario);
    const res = await fetch(`${servidor}/inventario/last/grd`);
    const data = await res.json();
    //console.log(data.informe_Alfa.cod_alfa);
    navigate(`/grd/inventario/${data.ultimo[0].id_producto}/edit`);
    // setDisabledNextButton(false);
  };

  const handleFirstInventario = async () => {
    const res = await fetch(`${servidor}/inventario/first/grd`);
    if (res.ok) {
      const firstInventario = await res.json();
      //console.log(lastAlfa);
      if (firstInventario) {
        const id_inventario = firstInventario.primero[0].id_producto;
        navigate(`/grd/inventario/${id_inventario}/edit`);

        console.log("Primer id", firstInventario);
        setDisabledPrevButton(true);
        setDisabledNextButton(false);
      } else {
        console.log("No se encontró ningún registro.");
      }
    } else {
      console.error("Error al obtener el inventario.");
    }
  };

  const handleLastInventario = async () => {
    const res = await fetch(`${servidor}/inventario/last/grd`);
    if (res.ok) {
      const lastInventario = await res.json();
      //console.log(lastAlfa);
      if (lastInventario) {
        console.log(lastInventario.ultimo[0].id_producto);
        const id_inventario = lastInventario.ultimo[0].id_producto;
        navigate(`/grd/inventario/${id_inventario}/edit`);
        setLastIdInventario(id_inventario);
        setDisabledNextButton(true);
        setDisabledPrevButton(false);
      } else {
        console.log("No se encontró ningún expediente.");
      }
    } else {
      console.error("Error al obtener el último expediente.");
    }
  };

  const handlePrevious = async () => {
    try {
      const response = await fetch(
        `${servidor}/inventario/prev/grd/${params.id}`
      );
      const data = await response.json();

      if (
        data?.inventario_prev?.length > 0 &&
        data.inventario_prev[0].id_producto
      ) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/grd/inventario/${data.inventario_prev[0].id_producto}/edit`);
        setDisabledNextButton(false);
      } else {
        setDisabledPrevButton(true);
        console.log("No hay registro anterior.");
      }
    } catch (error) {
      console.error("Error al obtener registro:", error);
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch(
        `${servidor}/inventario/next/grd/${params.id}`
      );
      const data = await response.json();

      if (
        data?.inventario_next?.length > 0 &&
        data?.inventario_next[0].id_producto
      ) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/grd/inventario/${data.inventario_next[0].id_producto}/edit`);
        setDisabledPrevButton(false);
      } else {
        setDisabledNextButton(true);
        console.log("No hay expedientes.");
      }
    } catch (error) {
      console.error("Error al obtener expediente :", error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleFirstInventario}
        disabled={disabledPrevButton}
      >
        Primer objeto
      </button>
      <button
        type="button"
        onClick={handlePrevious}
        disabled={disabledPrevButton}
      >
        Atras
      </button>
      <button type="button" onClick={handleNext} disabled={disabledNextButton}>
        Siguiente
      </button>
      <button
        type="button"
        onClick={handleLastInventario}
        disabled={disabledNextButton}
      >
        Ultimo objeto
      </button>

      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Codigo del producto</label>
        <input
          type="text"
          name="cod_producto"
          value={inventarios.cod_producto}
          onChange={handleChanges}
          disabled={editing}
        />

        <label htmlFor="">Marca</label>
        <input
          type="text"
          name="marca"
          value={inventarios.marca}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Modelo</label>
        <input
          type="text"
          name="modelo"
          id=""
          value={inventarios.modelo}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Serial</label>
        <input
          type="text"
          name="serial"
          value={inventarios.serial}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Descripción del producto</label>
        <input
          type="text"
          name="desc_producto"
          id=""
          value={inventarios.desc_producto}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Unidad de medida</label>
        <input
          type="text"
          name="unidad_medida"
          id=""
          value={inventarios.unidad_medida}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Cantidad</label>
        <input
          type="number"
          name="existencias"
          id=""
          value={inventarios.existencias}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Precio Unitario</label>
        <input
          type="number"
          name="precio_unitario"
          value={inventarios.precio_unitario}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Precio Total</label>
        <input
          type="number"
          name="precio_total"
          value={inventarios.precio_total}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Prestamo</label>
        <label htmlFor="Sí">Sí</label>
        <input
          type="radio"
          name="prestamo"
          id="Sí"
          value={"Sí"}
          checked={inventarios.prestamo === "Sí"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="No">No</label>
        <input
          type="radio"
          name="prestamo"
          id="No"
          value={"No"}
          checked={inventarios.prestamo === "No"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Usuario Prestamo</label>
        <input
          type="text"
          name="usuario_prestamo"
          value={inventarios.usuario_prestamo}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Ubicación</label>
        <select
          name="ubicacion"
          id=""
          value={inventarios.ubicacion}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="Bodega">Bodega Municipal</option>
          <option value="Oficina">Oficina</option>
        </select>
        <label htmlFor="">Observaciones</label>
        <textarea
          name="observaciones"
          id=""
          value={inventarios.observaciones}
          onChange={handleChanges}
          disabled={editing}
        ></textarea>
        <label htmlFor="">Usuario</label>
        <input
          type="text"
          name="usuario_creador"
          value={inventarios.usuario_creador}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Fecha y hora de ingreso</label>
        <input
          type="datetime-local"
          name="fecha_creado"
          id=""
          value={inventarios.fecha_creado || ""}
          onChange={handleChanges}
          disabled={editing}
        />

        {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
        <button type="button" onClick={handleNewInventario}>
          Nuevo Expediente
        </button>
        <button
          type="button"
          onClick={handleEdit}
          style={{ display: editing ? "" : "none" }}
        >
          Editar
        </button>
        <button type="submit" style={{ display: editing ? "none" : "" }}>
          Guardar Informe
        </button>
        <button
          type="button"
          onClick={handleCancel}
          style={{ display: editing ? "none" : "" }}
        >
          Cancelar
        </button>
        <button type="button" onClick={handleDeleteInventario}>
          Eliminar
        </button>
      </form>
    </div>
  );
}

export default InventarioGRD;
