import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListUserPrestamo from "./ListUserPrestamo";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import InventarioGRD from "./InventarioGRD";
import InventarioPDF from "../PDFs/InventarioPDF";

function PrestamoInventario() {
  const defaultPrestamo = {
    user_prestamo: "",
    estado_prestamo: "",
    fecha_prestamo: "",
    fecha_devolucion: "",
    observ: "",
    user_creador: "",
    correo: "",
    telefono: "",
    id_producto: "",
    num_serie: "",
    cantidad: 0,
  };

  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const user_decoded = decoded;
  const nombre_responsable = [user_decoded.nombre, user_decoded.apellido]
    .filter(Boolean)
    .join(" ");

  const [prestamos, setPrestamos] = useState(defaultPrestamo);
  const [editing, setEditing] = useState(true);
  const [listado, setListado] = useState([]);

  const printRef = useRef(null);

  useEffect(() => {
    if (params.id) {
      loadPrestamo(params.id);
      listProductos();
    } else {
      setPrestamos(defaultPrestamo);
    }
  }, [params.id]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Prestamo productos",
  });

  const loadPrestamo = async (id) => {
    const res = await fetch(`${servidor}/inventario/prestamo/${id}`, {
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setPrestamos({
      ...defaultPrestamo,
      ...data[0],
      user_prestamo: data[0].user_prestamo || "",
      estado_prestamo: data[0].estado_prestamo || "",
      fecha_prestamo: data[0].fecha_prestamo,
      fecha_devolucion: data[0].fecha_devolucion,
      observ: data[0].observ || "",
      user_creador: data[0].user_creador || "",
      correo: data[0].correo || "",
      telefono: data[0].telefono || "",
      id_producto: data[0].id_producto || 0,
      num_serie: data[0].num_serie || "",
      cantidad: data[0].cantidad || "",
    });
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

  const listProductos = async () => {
    const res = await fetch(`${servidor}/inventario/listado`);
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();
    setListado(data);
  };

  const handleChanges = async (e) => {
    const { name, value } = e.target;
    setPrestamos({ ...prestamos, [name]: value });
    console.log(name, value);
  };

  const handleEdit = async () => {
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmar = window.confirm("¿Deseas guardar los cambios?");
    if (!confirmar) return;
    try {
      const url = params.id
        ? `${servidor}/inventario/prestamo/edit/${params.id}`
        : `${servidor}/inventario/prestamo/new`;
      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_creador: nombre_responsable,
          ...prestamos,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const lastPrestamoRes = await fetch(
        `${servidor}/inventario/last?type=prestamo`,
      );
      const lastPrestamoData = await lastPrestamoRes.json();

      if (lastPrestamoData && lastPrestamoData[0]) {
        //const lastId = lastInventarioData[0].id_producto;
        navigate(
          `/grd/inventario/prestamo/${lastPrestamoData[0].id_prestamo}/edit`,
        );
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

  const handleNewPrestamo = () => {
    navigate("/grd/inventario/prestamo/new");

    setEditing(false);
  };

  const handleCancel = async () => {
    const id = params.id;

    try {
      const res = await fetch(`${servidor}/inventario/last?type=prestamo`);

      if (!id) {
        if (res.ok) {
          const lastPrestamo = await res.json();
          if (lastPrestamo) {
            navigate(
              `/grd/inventario/prestamo/${lastPrestamo[0].id_inventario}/edit`,
            );
          }
        }
      }

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
  };

  const handleDeletePrestamo = async () => {
    const eliminar = window.confirm("¿Deseas eliminar el prestamo?");
    if (!eliminar) return;

    const id = params.id;
    await fetch(`${servidor}/inventario/prestamo/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updatePrestamo = { ...prestamos };
    delete updatePrestamo[id];
    setPrestamos(updatePrestamo);
    const res = await fetch(`${servidor}/inventario/last?type=prestamo`);
    const data = await res.json();

    navigate(`/grd/inventario/prestamo/${data[0].id_prestamo}/edit`);
  };

  const handleFirstPrestamo = async () => {
    const res = await fetch(`${servidor}/inventario/first?type=prestamo`);
    if (res.ok) {
      const firstPrestamo = await res.json();

      if (firstPrestamo) {
        const id = firstPrestamo[0].id_prestamo;
        navigate(`/grd/inventario/prestamo/${id}/edit`);
      } else {
        console.log("No se encontró ningún registro.");
      }
    } else {
      console.error("Error al obtener el inventario.");
    }
  };

  const handleLastPrestamo = async () => {
    const res = await fetch(`${servidor}/inventario/last?type=prestamo`);
    if (res.ok) {
      const lastPrestamo = await res.json();
      //console.log(lastAlfa);
      if (lastPrestamo) {
        const id = lastPrestamo[0].id_prestamo;
        navigate(`/grd/inventario/prestamo/${id}/edit`);
        //setLastIdInventario(id);
        //setDisabledNextButton(true);
        //setDisabledPrevButton(false);
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
        `${servidor}/inventario/prev/${params.id}?type=prestamo`,
      );
      const data = await response.json();

      if (data?.length > 0 && data[0].id_prestamo) {
        navigate(`/grd/inventario/prestamo/${data[0].id_prestamo}/edit`);

        //setDisabledNextButton(false);
      } else {
        //setDisabledPrevButton(true);
        console.log("No hay registro anterior.");
      }
    } catch (error) {
      console.error("Error al obtener registro:", error);
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch(
        `${servidor}/inventario/next/${params.id}?type=prestamo`,
      );
      const data = await response.json();

      if (data?.length > 0 && data[0]?.id_prestamo) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/grd/inventario/prestamo/${data[0].id_prestamo}/edit`);
        //setDisabledPrevButton(false);
      } else {
        //setDisabledNextButton(true);
        console.log("No hay registro.");
      }
    } catch (error) {
      console.error("Error al obtener registro:", error);
    }
  };

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleFirstPrestamo}
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
            onClick={handleLastPrestamo}
            //disabled={disabledNextButton}
          >
            Último registro <i className="bi bi-skip-end ms-1"></i>
          </button>
        </div>
        <div className="row">
          <div className="row">
            <div className="col-lg-5">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-success text-white d-flex justify-content-between">
                  <div>
                    <h4 className="card-title mb-0">Prestamo de productos</h4>
                    <strong>Código prestamo: {prestamos.id_prestamo}</strong>
                  </div>
                </div>
                <div className="card-body">
                  <form action="" onSubmit={handleSubmit}>
                    <div className="row">
                      <fieldset className="border border-primary rounded p-3">
                        <legend className="float-none w-auto px-2 h6 mb-0">
                          Fecha y estado prestamo
                        </legend>
                        <div className="row g-3">
                          <div className="col-md-auto">
                            <label
                              htmlFor="fecha_prestamo"
                              className="form-label"
                            >
                              Fecha de prestamo
                            </label>
                            <input
                              className="form-control"
                              type="datetime-local"
                              name="fecha_prestamo"
                              id="fecha_prestamo"
                              value={formatDateTimeLocal(
                                prestamos.fecha_prestamo,
                              )}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                          <div className="col-md-auto">
                            <label
                              htmlFor="fecha_devolucion"
                              className="form-label"
                            >
                              Fecha devolución
                            </label>
                            <input
                              className="form-control"
                              type="datetime-local"
                              name="fecha_devolucion"
                              id="fecha_devolucion"
                              value={formatDateTimeLocal(
                                prestamos.fecha_devolucion,
                              )}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                          <div className="col-md-auto">
                            <label
                              htmlFor="estado_prestamo"
                              className="form-label"
                            >
                              Estado de prestamo
                            </label>
                            <select
                              className="form-select"
                              name="estado_prestamo"
                              id="estado_prestamo"
                              value={prestamos.estado_prestamo}
                              onChange={handleChanges}
                              disabled={editing}
                            >
                              <option value="En prestamo">En prestamo</option>
                              <option value="Devuelta">Devuelta</option>
                              <option value="Cancelada">Cancelada</option>
                            </select>
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className="border border-primary rounded p-3">
                        <legend className="float-none w-auto px-2 h6 mb-0">
                          Producto en prestamo
                        </legend>
                        <div className="row g-3">
                          <div className="col-md-auto">
                            <label htmlFor="producto" className="form-label">
                              Productos:
                            </label>
                            <select
                              name="id_producto"
                              id="producto"
                              className="form-select"
                              value={prestamos.id_producto}
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
                          <div className="col-md-auto">
                            <label htmlFor="cantidad" className="form-label">
                              Cantidad solicitada:
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              name="cantidad"
                              id="cantidad"
                              value={prestamos.cantidad}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>

                          <div className="col-md-auto">
                            <label htmlFor="num_serie" className="form-label">
                              Número de Serie(si es que posee):
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="num_serie"
                              id="num_serie"
                              value={prestamos.num_serie}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className="border border-primary rounded p-3">
                        <legend className="float-none w-auto px-2 h6 mb-0">
                          Datos Solicitante y Observaciones
                        </legend>
                        <div className="row g-3">
                          <div className="col-md-auto">
                            <label
                              htmlFor="user_prestamo"
                              className="form-label"
                            >
                              Usuario solicitante:
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="user_prestamo"
                              id="user_prestamo"
                              value={prestamos.user_prestamo}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>

                          <div className="col-md-auto">
                            <label htmlFor="correo" className="form-label">
                              Correo Solicitante:
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              name="correo"
                              id="correo"
                              value={prestamos.correo}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                          <div className="col-md-auto">
                            <label htmlFor="telefono" className="form-label">
                              Teléfono
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="telefono"
                              id="telefono"
                              value={prestamos.telefono}
                              onChange={handleChanges}
                              disabled={editing}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label htmlFor="observ" className="form-label">
                              Observaciones
                            </label>
                            <textarea
                              rows={3}
                              className="form-control"
                              name="observ"
                              id="observ"
                              value={prestamos.observ}
                              onChange={handleChanges}
                              disabled={editing}
                            ></textarea>
                          </div>
                        </div>
                      </fieldset>

                      <div className="d-flex flex-wrap gap-2 mt-4">
                        {!editing && (
                          <div className="d-flex flex-wrap gap-2 mt-4">
                            <button type="submit" className="btn btn-primary">
                              <i className="bi bi-save"></i> Guardar
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
                    </div>
                  </form>

                  {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
                  {editing && (
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleNewPrestamo}
                      >
                        <i className="bi bi-clipboard2-plus"></i> Nuevo prestamo
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
                        onClick={handleDeletePrestamo}
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-footer text-end">
                  {editing && (
                    <button className="btn btn-danger" onClick={handlePrint}>
                      <i className="bi bi-file-earmark-pdf"></i>
                      Descargar PDF
                    </button>
                  )}
                </div>
                <div style={{ display: "none" }}>
                  <InventarioPDF ref={printRef} data={prestamos} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <ListUserPrestamo usuario={prestamos.user_prestamo} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrestamoInventario;
