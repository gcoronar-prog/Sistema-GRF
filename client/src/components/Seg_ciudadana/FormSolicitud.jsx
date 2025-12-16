import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SGCImagenPDF from "../PDFs/SGCImagenPDF";
import SelectSector from "../SelectSector";
import AttachFiles from "../AttachFiles";

function FormSolicitud() {
  const navigate = useNavigate();
  const params = useParams();
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const defaultSolicitudes = {
    //denuncia usuario
    entidad: "",
    num_parte: "",

    //datos solicitud
    descripcion_solicitud: "",
    fecha_siniestro: "",
    direccion_solicitud: "",
    sector_solicitud: "",
    estado_solicitud: "",

    //datos responsable
    nombre_responsable: "",
    institucion: "I. Municipalidad de San Antonio",
    rut_responsable: "",

    //datos usuarios
    fecha_solicitud: "",
    rut_solicitante: "",
    nombre_solicitante: "",
    telefono_solicitante: "",
    e_mail_solicitante: "",
  };

  const [solicitudes, setSolicitudes] = useState(defaultSolicitudes);
  const [lastId, setLastId] = useState("");
  const [editing, setEditing] = useState(true);
  const [selectedSector, setSelectedSector] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (params.id) {
      loadImagenes(params.id);
    } else {
      setSolicitudes(defaultSolicitudes);
      setSelectedSector("");
    }
  }, [params.id]);

  const loadImagenes = async (id) => {
    const res = await fetch(`${servidor}/imagenes/seg/${id}/edit`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();

    const formattedFecha = dayjs(data.soliGrabacion[0].fecha_siniestro).format(
      "YYYY-MM-DDTHH:mm"
    );

    const formattedFechaUser = dayjs(
      data.soliUsuarios[0].fecha_solicitud
    ).format("YYYY-MM-DDTHH:mm");

    setSolicitudes({
      //solicitud
      cod_solicitud: data.solicitud[0].cod_solicitud,

      //denuncia usuario
      entidad: data.soliDenuncia[0].entidad,
      num_parte: data.soliDenuncia[0].num_parte,

      //datos solicitud
      descripcion_solicitud: data.soliGrabacion[0].descripcion_solicitud,
      fecha_siniestro: formattedFecha,
      direccion_solicitud: data.soliGrabacion[0].direccion_solicitud,
      // sector_solicitud: data.soliGrabacion[0].sector_solicitud,
      estado_solicitud: data.soliGrabacion[0].estado_solicitud,

      //datos responsable
      nombre_responsable: data.soliResponsable[0].nombre_responsable,
      institucion: data.soliResponsable[0].institucion,
      rut_responsable: data.soliResponsable[0].rut_responsable,

      //datos usuarios
      fecha_solicitud: formattedFechaUser,
      rut_solicitante: data.soliUsuarios[0].rut_solicitante,
      nombre_solicitante: data.soliUsuarios[0].nombre_solicitante,
      telefono_solicitante: data.soliUsuarios[0].telefono_solicitante,
      e_mail_solicitante: data.soliUsuarios[0].e_mail_solicitante,
    });
    setSelectedSector(data.soliGrabacion[0].sector_solicitud);
  };

  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    setSolicitudes({
      ...solicitudes,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmar = window.confirm("¿Deseas guardar los cambios?");
    if (!confirmar) return;

    try {
      const url = params.id
        ? `${servidor}/imagenes/seg/${params.id}/edit`
        : `${servidor}/imagenes/seg/new`;

      const method = params.id ? "PUT" : "POST";
      const solicitudIMG = { ...solicitudes, sector_solicitud: selectedSector };
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(solicitudIMG),
      });
      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }
      console.log(params.id);
      const lastData = await fetch(`${servidor}/seg/imagenes/last`);

      const lastSolicitud = await lastData.json();
      setLastId(lastSolicitud.ultima[0].id_solicitud);

      if (lastSolicitud && lastSolicitud.ultima[0]) {
        const lastIdSoli = lastSolicitud.ultima[0].id_solicitud;
        navigate(`/sc/imagenes/${lastIdSoli + 1}`);
      }

      const metodo = params.id ? "" : `/sc/imagenes/${lastId + 1}`;
      navigate(metodo);
      setEditing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
  };

  const handleFirstSoli = async () => {
    const res = await fetch(`${servidor}/seg/imagenes/first`);
    if (res.ok) {
      const firstSoli = await res.json();
      if (firstSoli) {
        const id_soli = firstSoli.primera[0].id_solicitud;
        navigate(`/sc/imagenes/${id_soli}`);
      } else {
        console.log("no se encuentran registros");
      }
    } else {
      console.log("Error obteniendo registros");
    }
  };

  const handleLastSoli = async () => {
    const res = await fetch(`${servidor}/seg/imagenes/last`);
    if (res.ok) {
      const lastSoli = await res.json();
      if (lastSoli) {
        const id_soli = lastSoli.ultima[0].id_solicitud;
        navigate(`/sc/imagenes/${id_soli}`);
      } else {
        console.log("No hay registros");
      }
    } else {
      console.log("Error obteniendo datos");
    }
  };

  const handlePrevious = async () => {
    try {
      const response = await fetch(
        `${servidor}/seg/imagenes/prev/${params.id}`
      );
      const data = await response.json();

      if (data?.previo?.length > 0 && data.previo[0].id_solicitud) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/sc/imagenes/${data.previo[0].id_solicitud}`);
        //setDisabledNextButton(false);
      } else {
        // setDisabledPrevButton(true);
        console.log("No hay registro anterior.");
      }
    } catch (error) {
      console.error("Error al obtener registro:", error);
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch(
        `${servidor}/seg/imagenes/next/${params.id}`
      );
      const data = await response.json();

      if (data?.next?.length > 0 && data.next[0].id_solicitud) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/sc/imagenes/${data.next[0].id_solicitud}`);
        //setDisabledNextButton(false);
      } else {
        // setDisabledPrevButton(true);
        console.log("No hay registro anterior.");
      }
    } catch (error) {
      console.error("Error al obtener registro:", error);
    }
  };

  const handleNewSoli = () => {
    navigate("/sc/imagenes/new");
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = async () => {
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = async () => {
    const id = params.id;

    try {
      const res = await fetch(`${servidor}/seg/imagenes/last`);

      if (!id) {
        if (res.ok) {
          const lastSoli = await res.json();
          if (lastSoli) {
            navigate(`/sc/imagenes/${lastSoli.ultima[0].id_solicitud}`);
            console.log("ultima id", lastSoli.ultima[0].id_solicitud);
          }
        }
      }

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSoli = async () => {
    const eliminar = window.confirm("¿Deseas eliminar el informe?");
    if (!eliminar) return;
    const id = params.id;
    await fetch(`${servidor}/imagenes/seg/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedSoli = { ...solicitudes };
    delete updatedSoli[id];
    setSolicitudes(updatedSoli);

    const res = await fetch(`${servidor}/seg/imagenes/last`);
    const data = await res.json();
    navigate(`/sc/imagenes/${data.ultima[0].id_solicitud}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleFirstSoli}
          disabled={
            //disabledPrevButton
            false
          }
        >
          <i className="bi bi-skip-start me-1"></i> Primera solicitud
        </button>
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handlePrevious}
          disabled={
            //disabledPrevButton
            false
          }
        >
          <i className="bi bi-chevron-left me-1"></i> Anterior
        </button>
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleNext}
          disabled={
            //disabledNextButton
            false
          }
        >
          Siguiente <i className="bi bi-chevron-right ms-1"></i>
        </button>
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleLastSoli}
          disabled={
            false
            //disabledNextButton
          }
        >
          Última solicitud <i className="bi bi-skip-end ms-1"></i>
        </button>
      </div>

      <div className="row">
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white d-flex justify-content-between">
              <div>
                <h4 className="card-title mb-0">
                  Formulario Solicitud de Imágenes
                </h4>
                <strong>Código solicitud: {solicitudes.cod_solicitud}</strong>
              </div>
            </div>
            <div className="card-body">
              <form className="was-validated" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Fecha de solicitud</label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      name="fecha_solicitud"
                      value={solicitudes.fecha_solicitud}
                      onChange={handleChanges}
                      disabled={editing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="d-flex form-label">
                      Estado de la solicitud
                    </label>
                    <div className="row">
                      <div className="col">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="estado_solicitud"
                            id="pendiente"
                            value={"Pendiente"}
                            checked={
                              solicitudes.estado_solicitud === "Pendiente"
                            }
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label htmlFor="pendiente">Pendiente</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="estado_solicitud"
                            id="revision"
                            value={"Revisión"}
                            checked={
                              solicitudes.estado_solicitud === "Revisión"
                            }
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label htmlFor="revision">Revisión</label>
                        </div>
                      </div>

                      <div className="col">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="estado_solicitud"
                            id="entregada"
                            value={"Entregada"}
                            checked={
                              solicitudes.estado_solicitud === "Entregada"
                            }
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label htmlFor="entregada">Entregada</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="estado_solicitud"
                            id="nula"
                            value={"Nula"}
                            checked={solicitudes.estado_solicitud === "Nula"}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label htmlFor="nula">Nula</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <fieldset className="border rounded-3 p-3 mb-4">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Datos solicitante
                    </legend>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label">Rut</label>
                        <input
                          className="form-control"
                          type="text"
                          name="rut_solicitante"
                          value={solicitudes.rut_solicitante}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input
                          className="form-control"
                          type="text"
                          name="nombre_solicitante"
                          value={solicitudes.nombre_solicitante}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Teléfono</label>
                        <input
                          className="form-control"
                          type="text"
                          name="telefono_solicitante"
                          value={solicitudes.telefono_solicitante}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">E-mail</label>
                        <input
                          className="form-control"
                          type="email"
                          name="e_mail_solicitante"
                          value={solicitudes.e_mail_solicitante}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border rounded-3 p-3 mb-4">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Datos responsable
                    </legend>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label">Rut</label>
                        <input
                          className="form-control"
                          type="text"
                          name="rut_responsable"
                          value={solicitudes.rut_responsable}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input
                          className="form-control"
                          type="text"
                          name="nombre_responsable"
                          value={solicitudes.nombre_responsable}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Institución</label>
                        <input
                          className="form-control"
                          type="text"
                          name="institucion"
                          value={solicitudes.institucion}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border rounded-3 p-3 mb-4">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Datos Solicitud
                    </legend>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label">Fecha solicitada</label>
                        <input
                          className="form-control"
                          type="datetime-local"
                          name="fecha_siniestro"
                          value={solicitudes.fecha_siniestro}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Sector</label>
                        <SelectSector
                          selectedSector={selectedSector}
                          setSelectedSector={setSelectedSector}
                          edition={editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Dirección</label>
                        <input
                          className="form-control"
                          type="text"
                          name="direccion_solicitud"
                          value={solicitudes.direccion_solicitud}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Descripción de la solicitud
                        </label>
                        <textarea
                          className="form-control"
                          cols={6}
                          name="descripcion_solicitud"
                          id=""
                          value={solicitudes.descripcion_solicitud}
                          onChange={handleChanges}
                          disabled={editing}
                        ></textarea>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Entidad en la que se denuncia
                        </label>
                        <select
                          className="form-select"
                          name="entidad"
                          id=""
                          value={solicitudes.entidad}
                          onChange={handleChanges}
                          disabled={editing}
                        >
                          <option value="">Seleccione entidad</option>
                          <option value="JPL 1">JPL 1</option>
                          <option value="JPL 2">JPL 2</option>
                          <option value="Carabineros">Carabineros</option>
                          <option value="PDI">PDI</option>
                          <option value="Fiscalía">Fiscalía</option>
                          <option value="Otra institución">
                            Otra institución
                          </option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          N° de parte / documento
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="num_parte"
                          value={solicitudes.num_parte}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>

                {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
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
              {editing && (
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={handleNewSoli}
                  >
                    <i className="bi bi-clipboard2-plus"></i> Nueva solicitud
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleEdit}
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={handleDeleteSoli}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              )}
            </div>
            <div className="card-footer text-end">
              {editing && (
                <button
                  className="btn btn-danger"
                  onClick={() => SGCImagenPDF(params.id)}
                >
                  <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {editing && (
        <div className="row mt-4">
          <div className="col-12">
            <AttachFiles idInforme={solicitudes.cod_solicitud} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FormSolicitud;
