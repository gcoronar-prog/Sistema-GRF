import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListEntradas from "./ListEntradas";
import EntradasInventPDF from "../PDFs/EntradasInventPDF";
import { useReactToPrint } from "react-to-print";

function EntradaInventario() {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const user_decoded = decoded;
  const nombre_responsable = [user_decoded.nombre, user_decoded.apellido]
    .filter(Boolean)
    .join(" ");
  const defaultEntradas = {
    ubicacion: "",
    observaciones: "",
    usuario_creador: "",
    cantidad: "",
    tipo_producto: "",
    factura: "",
    orden_compra: "",
    proveedor: "",
    producto: "",
    precio_unitario: "",
    id_producto: "",
    unid_medida: "",
    tipo_form: "",
  };
  const fechaIngresoRef = useRef(null);
  const productosRef = useRef(null);
  const cantidadRef = useRef(null);
  const precioUnitarioRef = useRef(null);

  const [entradas, setEntradas] = useState(defaultEntradas);
  const [editing, setEditing] = useState(true);
  const [listado, setListado] = useState([]);
  const [estado, setEstado] = useState(1);
  const [hasError, setHasError] = useState(false);

  const printRef = useRef(null);

  useEffect(() => {
    if (params.id) {
      loadEntrada(params.id);
      listProductos();
    } else {
      setEntradas(defaultEntradas);
    }
  }, [params.id]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Entrada/Salida productos",
  });

  const loadEntrada = async (id) => {
    const res = await fetch(`${servidor}/inventario/entrada/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();

    if (data[0].tipo_form === "entrada") {
      setEstado(1);
    } else {
      setEstado(2);
    }

    setEntradas({
      ...defaultEntradas,
      ...data[0],
      id_inventario: data[0].id_inventario || "",
      ubicacion: data[0].ubicacion || "",
      observaciones: data[0].observaciones || "",
      usuario_creador: data[0].usuario_creador || "",
      fecha_creado: data[0].fecha_creado || "",
      cantidad: data[0].cantidad || "",
      tipo_producto: data[0].tipo_producto || "",
      factura: data[0].factura || "",
      orden_compra: data[0].orden_compra || "",
      proveedor: data[0].proveedor || "",
      producto: data[0].producto || "",
      precio_unitario: data[0].precio_unitario || "",
      id_producto: data[0].id_producto || "",
      unid_medida: data[0].unid_medida || "",
      tipo_form: data[0].tipo_form || "",
    });
  };

  const listProductos = async () => {
    const res = await fetch(`${servidor}/inventario/listado`);
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();
    setListado(data);
  };
  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);

    const pad = (n) => String(n).padStart(2, "0");

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setEntradas({ ...entradas, [name]: value });
    console.log(value);
  };

  const handleEdit = async () => {
    setEditing(false);
    setHasError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmpty = (value) => {
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === "string") return value.trim() === "";
      return value === null || value === undefined;
    };

    const requerido = [
      { field: entradas.fecha_creado, ref: fechaIngresoRef },
      { field: entradas.nombre_producto, ref: productosRef },
      { field: entradas.cantidad, ref: cantidadRef },
      { field: entradas.precio_unitario, ref: precioUnitarioRef },
    ];

    const errorRequerido = requerido.find((f) => isEmpty(f.field));

    if (errorRequerido) {
      alert("Debe completar los campos obligatorios.");
      setHasError(true);

      const el = errorRequerido.ref.current;

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        if (typeof el.focus === "function") {
          el.focus();
        } else {
          el.querySelector("input, select, textarea")?.focus();
        }
      }

      console.log(errorRequerido);
      return;
    }

    setHasError(false);

    const confirmar = window.confirm("¿Deseas guardar los cambios?");

    if (!confirmar) return;
    try {
      const url = params.id
        ? `${servidor}/inventario/entrada/edit/${params.id}`
        : `${servidor}/inventario/entrada/new`;
      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_creador: nombre_responsable,
          ...entradas,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const lastEntradaRes = await fetch(
        `${servidor}/inventario/last?type=entrada`,
      );
      const lastEntradaData = await lastEntradaRes.json();

      if (lastEntradaData && lastEntradaData[0]) {
        //const lastId = lastInventarioData[0].id_producto;
        navigate(
          `/grd/inventario/entrada/${lastEntradaData[0].id_inventario}/edit`,
        );

        console.log(usuario_creador);
      }

      /*const metodo = params.id
        ? ""
        : `grd/inventario/entrada/${lastEntradaData[0].id_inventario}/edit`;
      navigate(metodo);*/
      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
  };

  const handleNewEntrada = () => {
    navigate("/grd/inventario/entrada/new");

    setEditing(false);
  };

  const handleCancel = async () => {
    const id = params.id;

    try {
      const res = await fetch(`${servidor}/inventario/last?type=entrada`);

      if (!id) {
        if (res.ok) {
          const lastEntrada = await res.json();
          if (lastEntrada) {
            navigate(
              `/grd/inventario/entrada/${lastEntrada[0].id_inventario}/edit`,
            );
          }
        }
      }

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
    setHasError(false);
  };

  const handleDeleteEntrada = async () => {
    const eliminar = window.confirm("¿Deseas eliminar la entrada?");
    if (!eliminar) return;

    const id = params.id;
    await fetch(`${servidor}/inventario/entrada/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updateEntradas = { ...entradas };
    delete updateEntradas[id];
    setEntradas(updateEntradas);
    const res = await fetch(`${servidor}/inventario/last?type=entrada`);
    const data = await res.json();

    navigate(`/grd/inventario/entrada/${data[0].id_inventario}/edit`);
  };

  const handleFirstEntrada = async () => {
    const res = await fetch(`${servidor}/inventario/first?type=entrada`);
    if (res.ok) {
      const firstEntrada = await res.json();

      if (firstEntrada) {
        const id = firstEntrada[0].id_inventario;
        navigate(`/grd/inventario/entrada/${id}/edit`);
      } else {
        console.log("No se encontró ningún registro.");
      }
    } else {
      console.error("Error al obtener el inventario.");
    }
    setHasError(false);
  };

  const HandleLastEntrada = async () => {
    const res = await fetch(`${servidor}/inventario/last?type=entrada`);
    if (res.ok) {
      const lastEntrada = await res.json();
      //console.log(lastAlfa);
      if (lastEntrada) {
        const id = lastEntrada[0].id_inventario;
        navigate(`/grd/inventario/entrada/${id}/edit`);
        //setLastIdInventario(id);
        //setDisabledNextButton(true);
        //setDisabledPrevButton(false);
      } else {
        console.log("No se encontró ningún expediente.");
      }
    } else {
      console.error("Error al obtener el último expediente.");
    }
    setHasError(false);
  };

  const handlePrevious = async () => {
    try {
      const response = await fetch(
        `${servidor}/inventario/prev/${params.id}?type=entrada`,
      );
      const data = await response.json();

      if (data?.length > 0 && data[0].id_inventario) {
        navigate(`/grd/inventario/entrada/${data[0].id_inventario}/edit`);

        //setDisabledNextButton(false);
      } else {
        //setDisabledPrevButton(true);
        console.log("No hay registro anterior.");
      }
    } catch (error) {
      console.error("Error al obtener registro:", error);
    }
    setHasError(false);
  };

  const handleNext = async () => {
    try {
      const response = await fetch(
        `${servidor}/inventario/next/${params.id}?type=entrada`,
      );
      const data = await response.json();

      if (data?.length > 0 && data[0]?.id_inventario) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/grd/inventario/entrada/${data[0].id_inventario}/edit`);
        //setDisabledPrevButton(false);
      } else {
        //setDisabledNextButton(true);
        console.log("No hay expedientes.");
      }
    } catch (error) {
      console.error("Error al obtener expediente :", error);
    }
    setHasError(false);
  };

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleFirstEntrada}
            // disabled={disabledPrevButton}
          >
            <i className="bi bi-skip-start me-1"></i> Primer registro
          </button>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handlePrevious}
            //disabled={disabledPrevButton}
          >
            <i className="bi bi-chevron-left me-1"></i> Anterior
          </button>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleNext}
            //disabled={disabledNextButton}
          >
            Siguiente <i className="bi bi-chevron-right ms-1"></i>
          </button>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={HandleLastEntrada}
            //disabled={disabledNextButton}
          >
            Último registro <i className="bi bi-skip-end ms-1"></i>
          </button>
        </div>
        <div className="row">
          <div className="col-lg-5">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-success text-white d-flex justify-content-between">
                <div>
                  <h4 className="card-title mb-0">Entrada de productos</h4>
                  <strong>Código producto: {entradas.id_inventario}</strong>
                </div>
              </div>
              <div className="card-body">
                <form action="" onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center mb-3 gap-2 flex-wrap">
                    <div className="btn-group mb-2">
                      <button
                        type="button"
                        className={`btn ${
                          estado === 1 ? "btn-success" : "btn-outline-success"
                        }`}
                        onClick={() => {
                          (setEstado(1), (entradas.tipo_form = "entrada"));
                        }}
                        disabled={editing}
                      >
                        Entradas
                      </button>
                      <button
                        type="button"
                        className={`btn ${
                          estado === 2 ? "btn-danger" : "btn-outline-danger"
                        }`}
                        onClick={() => {
                          (setEstado(2), (entradas.tipo_form = "salida"));
                        }}
                        disabled={editing}
                      >
                        Salidas
                      </button>
                    </div>
                  </div>
                  <div className="row g-4">
                    <fieldset className="border border-primary rounded p-3">
                      <legend className="float-none w-auto px-2 h6 mb-0">
                        Detalle Productos
                      </legend>
                      <div className="row g-3">
                        <div className="col-md-auto" ref={fechaIngresoRef}>
                          <label htmlFor="fecha_creado" className="form-label">
                            Fecha de ingreso:
                          </label>
                          <div
                            className={hasError ? "rounded error-focus" : ""}
                          >
                            <input
                              className="form-control"
                              type="datetime-local"
                              id="fecha_creado"
                              name="fecha_creado"
                              value={formatDateTimeLocal(entradas.fecha_creado)}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                          {hasError && (
                            <div className="text-danger small">
                              *Campo obligatorio
                            </div>
                          )}
                        </div>
                        <div className="col-md-auto">
                          <label
                            htmlFor="productos"
                            className="form-label"
                            ref={productosRef}
                          >
                            Productos
                          </label>
                          <div
                            className={hasError ? "rounded error-focus" : ""}
                          >
                            <select
                              name="id_producto"
                              id="id_producto"
                              className="form-select"
                              value={entradas.id_producto}
                              onChange={handleChanges}
                              disabled={editing}
                            >
                              <option value="">Seleccione producto</option>
                              {listado.map((p) => (
                                <option value={p.id_producto}>
                                  {p.nombre_producto}
                                </option>
                              ))}
                            </select>
                          </div>
                          {hasError && (
                            <div className="text-danger small">
                              *Campo obligatorio
                            </div>
                          )}
                        </div>
                        <div className="col-md-auto">
                          <label htmlFor="tipo_producto" className="form-label">
                            Tipo producto
                          </label>
                          <select
                            name="tipo_producto"
                            id="tipo_producto"
                            className="form-select"
                            value={entradas.tipo_producto || ""}
                            onChange={handleChanges}
                            disabled={editing}
                          >
                            <option value="">
                              Seleccione tipo de productos
                            </option>
                            <option value="Clavos">Clavos</option>
                            <option value="Herramientas">Herramientas</option>
                          </select>
                        </div>
                        <div className="col-md-auto" ref={cantidadRef}>
                          <label htmlFor="cantidad" className="form-label">
                            Cantidad
                          </label>
                          <div
                            className={hasError ? "rounded error-focus" : ""}
                          >
                            <input
                              className="form-control"
                              type="number"
                              name="cantidad"
                              id="cantidad"
                              value={entradas.cantidad || ""}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                        </div>
                        {hasError && (
                          <div className="text-danger small">
                            *Campo obligatorio
                          </div>
                        )}
                        <div className="col-md-4">
                          <label htmlFor="unid_medida" className="form-label">
                            Unidad de medida
                          </label>
                          <select
                            name="unid_medida"
                            id="unid_medida"
                            className="form-select"
                            disabled={editing}
                            value={entradas.unid_medida || ""}
                            onChange={handleChanges}
                          >
                            <option value="">
                              Seleccione unidad de medida
                            </option>
                            <option value="kgs">Kilogramos</option>
                            <option value="lts">Litros</option>
                            <option value="sacos">Sacos</option>
                          </select>
                        </div>
                        <div className="col-md-auto" ref={precioUnitarioRef}>
                          <label
                            htmlFor="precio_unitario"
                            className="form-label"
                          >
                            Precio unitario
                          </label>
                          <div
                            className={hasError ? "rounded error-focus" : ""}
                          >
                            <input
                              className="form-control"
                              type="text"
                              name="precio_unitario"
                              id="precio_unitario"
                              value={entradas.precio_unitario || ""}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                          {hasError && (
                            <div className="text-danger small">
                              *Campo obligatorio
                            </div>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="ubicacion1" className="form-label">
                            Ubicación
                          </label>
                          <select
                            name="ubicacion"
                            id="ubicacion1"
                            className="form-select"
                            value={entradas.ubicacion}
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
                      </div>
                    </fieldset>
                  </div>
                  <div className="row g-4">
                    <fieldset className="border border-primary rounded p-3">
                      <legend className="float-none w-auto px-2 h6 mb-0">
                        Detalles compra
                      </legend>
                      <div className="row g-3">
                        <div className="col-md-auto">
                          <label htmlFor="factura" className="form-label">
                            N° Factura
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="factura"
                            id="factura"
                            value={entradas.factura || ""}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                        </div>
                        <div className="col-md-auto">
                          <label htmlFor="orden_compra" className="form-label">
                            Orden de compra
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="orden_compra"
                            id="orden_compra"
                            value={entradas.orden_compra || ""}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="proveedor" className="form-label">
                            Proveedor
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="proveedor"
                            id="proveedor"
                            value={entradas.proveedor || ""}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                        </div>
                        <div className="col-md-auto">
                          <label htmlFor="observaciones" className="form-label">
                            Observación del producto
                          </label>
                          <textarea
                            type="text"
                            className="form-control"
                            cols={95}
                            rows={3}
                            name="observaciones"
                            id="observaciones"
                            value={entradas.observaciones || ""}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>

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
                  <div className="d-flex flex-wrap gap-2 pb-2">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleNewEntrada}
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
                      onClick={handleDeleteEntrada}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                )}
                <div className="card-footer text-end">
                  {editing && (
                    <button className="btn btn-danger" onClick={handlePrint}>
                      <i className="bi bi-file-earmark-pdf"></i>
                      Descargar PDF
                    </button>
                  )}
                </div>
                <div style={{ display: "none" }}>
                  <EntradasInventPDF ref={printRef} data={entradas} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-auto">
            <ListEntradas />
          </div>
        </div>
      </div>
    </>
  );
}

export default EntradaInventario;
