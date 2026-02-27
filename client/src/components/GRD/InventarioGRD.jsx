import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InventarioGRD() {
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const user_decoded = decoded;
  const nombre_responsable = [user_decoded.nombre, user_decoded.apellido]
    .filter(Boolean)
    .join(" ");

  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const defaultInventario = {
    nombre_producto: "",
    observ_produ: "",
    tipo_produ: "",
    cantidad: 0,
    precio_unit: 0,
    ubicacion: "",
    serial: "",
    modelo: "",
    marca: "",
    unidad_medida: "",
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

    setInventarios({
      id_producto: data[0].id_producto,
      nombre_producto: data[0].nombre_producto,
      observ_produ: data[0].observ_produ,
      tipo_produ: data[0].tipo_produ,
      cantidad: data[0].cantidad,
      precio_unit: data[0].precio_unit,
      serial: data[0].serial,
      ubicacion: data[0].ubicacion,
      fecha_creado: data[0].fecha_creado,
      unidad_medida: data[0].unidad_medida,
      usuario_creador: nombre_responsable,
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
    console.log("Datos enviados", inventarios);

    try {
      const url = params.id
        ? `${servidor}/inventario/grd/edit/${params.id}`
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

      const lastInventarioRes = await fetch(
        `${servidor}/inventario/last?type=producto`,
      );
      const lastInventarioData = await lastInventarioRes.json();

      if (lastInventarioData && lastInventarioData[0]) {
        //const lastId = lastInventarioData[0].id_producto;
        navigate(
          `/inventario/grd/${lastInventarioData[0].id_producto + 1}/edit`,
        );
      }

      const metodo = params.id
        ? ""
        : `/grd/inventario/${lastInventarioData[0].id_producto}/edit`;
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
      const res = await fetch(`${servidor}/inventario/last?type=producto`);

      if (!id) {
        if (res.ok) {
          const lastInventario = await res.json();
          if (lastInventario) {
            navigate(`/grd/inventario/${lastInventario[0].id_producto}/edit`);
            console.log("ultima id", lastInventario[0].id_producto);
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

    await fetch(`${servidor}/inventario/grd/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updateInventario = { ...inventarios };
    delete updateInventario[id];
    setInventarios(updateInventario);
    const res = await fetch(`${servidor}/inventario/last?type=producto`);
    const data = await res.json();
    //console.log(data.informe_Alfa.cod_alfa);
    navigate(`/grd/inventario/${data[0].id_producto}/edit`);
    // setDisabledNextButton(false);
  };

  const handleFirstInventario = async () => {
    const res = await fetch(`${servidor}/inventario/first?type=producto`);
    if (res.ok) {
      const firstInventario = await res.json();
      //console.log(lastAlfa);
      if (firstInventario) {
        const id_inventario = firstInventario[0].id_producto;
        navigate(`/grd/inventario/${id_inventario}/edit`);

        //console.log("Primer id", firstInventario);
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
    const res = await fetch(`${servidor}/inventario/last?type=producto`);
    if (res.ok) {
      const lastInventario = await res.json();
      //console.log(lastAlfa);
      if (lastInventario) {
        console.log(lastInventario[0].id_producto);
        const id_inventario = lastInventario[0].id_producto;
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
        `${servidor}/inventario/prev/${params.id}?type=producto`,
      );
      const data = await response.json();

      if (data?.length > 0 && data[0].id_producto) {
        navigate(`/grd/inventario/${data[0].id_producto}/edit`);

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
        `${servidor}/inventario/next/${params.id}?type=producto`,
      );
      const data = await response.json();

      if (data?.length > 0 && data[0]?.id_producto) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/grd/inventario/${data[0].id_producto}/edit`);
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
    <>
      <div className="container-fluid mt-4">
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleFirstInventario}
            disabled={disabledPrevButton}
          >
            <i className="bi bi-skip-start me-1"></i> Primer registro
          </button>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handlePrevious}
            disabled={disabledPrevButton}
          >
            <i className="bi bi-chevron-left me-1"></i> Anterior
          </button>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleNext}
            disabled={disabledNextButton}
          >
            Siguiente <i className="bi bi-chevron-right ms-1"></i>
          </button>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleLastInventario}
            disabled={disabledNextButton}
          >
            Último registro <i className="bi bi-skip-end ms-1"></i>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white d-flex justify-content-between">
              <div>
                <h4 className="card-title mb-0">Inventario GRD</h4>
                <strong>Código producto: {inventarios.id_producto}</strong>
              </div>
            </div>
            <div className="card-body">
              <form action="" onSubmit={handleSubmit}>
                <fieldset className="border border-primary rounded p-3">
                  <legend className="float-none w-auto px-2 h6 mb-0">
                    Datos producto
                  </legend>
                  <div className="row g-3">
                    <div className="col-md-auto">
                      <label htmlFor="nombre_producto" className="form-label">
                        Nombre del producto
                      </label>
                      <input
                        type="text"
                        id="nombre_producto"
                        name="nombre_producto"
                        className="form-control"
                        value={inventarios.nombre_producto}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>

                    <div className="col-md-auto">
                      <label htmlFor="tipo_produ" className="form-label">
                        Tipo producto
                      </label>
                      <input
                        type="text"
                        name="tipo_produ"
                        id="tipo_produ"
                        className="form-control"
                        value={inventarios.tipo_produ}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="marca" className="form-label">
                        Marca
                      </label>
                      <input
                        type="text"
                        name="marca"
                        id="marca"
                        className="form-control"
                        value={inventarios.marca}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="modelo">Modelo</label>
                      <input
                        type="text"
                        name="modelo"
                        id="modelo"
                        className="form-control"
                        value={inventarios.modelo}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="serial">Serial</label>
                      <input
                        type="text"
                        name="serial"
                        id="serial"
                        className="form-control"
                        value={inventarios.serial}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                  </div>
                </fieldset>
                <fieldset className="border border-primary rounded p-3">
                  <legend className="float-none w-auto px-2 h6 mb-0">
                    Detalles producto
                  </legend>
                  <div className="row g-3">
                    <div className="col-md-auto">
                      <label htmlFor="cantidad">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        id="cantidad"
                        className="form-control"
                        value={inventarios.cantidad}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="unidad_medida">Unidad de medida</label>
                      <input
                        type="text"
                        name="unidad_medida"
                        className="form-control"
                        id="unidad_medida"
                        value={inventarios.unidad_medida}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="precio_unit">Precio Unitario</label>
                      <input
                        type="number"
                        name="precio_unit"
                        id="precio_unit"
                        className="form-control"
                        value={inventarios.precio_unit}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="observ_produ">
                        Descripción del producto
                      </label>
                      <textarea
                        type="text"
                        name="observ_produ"
                        className="form-control"
                        id="observ_produ"
                        value={inventarios.observ_produ}
                        onChange={handleChanges}
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="ubicacion1">Ubicación</label>
                      <select
                        name="ubicacion"
                        id="ubicacion1"
                        className="form-select"
                        value={inventarios.ubicacion}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">
                          Seleccione ubicación de insumos
                        </option>
                        <option value="Bodega">Bodega Municipal</option>
                        <option value="Oficina">Oficina</option>
                      </select>
                    </div>
                    <div className="col-md-auto"></div>
                  </div>

                  <label htmlFor="">Usuario: </label>
                  <span>{inventarios.usuario_creador}</span>
                </fieldset>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {!editing && (
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Guardar Informe
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={handleCancel}
                      >
                        <i className="bi bi-x-octagon"></i> Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </form>

              {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
              {editing && (
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleNewInventario}
                  >
                    <i className="bi bi-clipboard2-plus"></i> Nuevo producto
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEdit}
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteInventario}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InventarioGRD;
