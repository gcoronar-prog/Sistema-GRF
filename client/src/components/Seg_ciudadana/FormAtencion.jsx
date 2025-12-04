import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AttachFiles from "../AttachFiles";
import FormAcciones from "../FormAcciones";
import { BlobProvider } from "@react-pdf/renderer";
import SCAtencionPDF from "../PDFs/SCAtencionPDF";
import SelectSector from "../SelectSector";
import { jwtDecode } from "jwt-decode";
import { useTokenSession } from "../useTokenSession";
import SelectPoblacion from "../SelectPoblacion";
import SelectJJVV from "../SelectJJVV";

function FormAtencion() {
  const defaultAtencion = {
    //atencion
    cod_atencion: "",

    //usuario
    nombre_solicitante: "",
    telefono_solicitante: "",
    correo_solicitante: "",
    rut_solicitante: "",

    //sector
    direccion_solicitante: "",
    sector_solicitante: "",
    poblacion_solicitante: "",
    junta_vecinos: "",

    //solicitud
    descripcion_solicitud: "",
    observaciones_solicitud: "",
    medidas_seguridad: "",
    espacios_publicos: "",

    //procesos
    fecha_solicitud: "",
    estado_solicitud: "",
    responsable_solicitud: "",
    medio_atencion: "",
    tipo_solicitud: "",
    temas_atencion: "",
  };

  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");

  const [atenciones, setAtenciones] = useState(defaultAtencion);
  const [editing, setEditing] = useState(true);
  const [lastId, setLastId] = useState("");
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedPobla, setSelectedPobla] = useState(null);
  const [selectedJJVV, setSelectedJJVV] = useState(null);

  useEffect(() => {
    if (params.id) {
      loadAtenciones(params.id);
    } else {
      setAtenciones(defaultAtencion);
    }
  }, [params.id]);

  const loadAtenciones = async (id) => {
    const res = await fetch(`${servidor}/atenciones/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();

    const formattedFecha = dayjs(data.proceso[0].fecha_solicitud).format(
      "YYYY-MM-DDTHH:mm"
    );
    setAtenciones({
      //atencion
      cod_atencion: data.atencion_ciudadana[0].cod_atencion,
      //usuario
      nombre_solicitante: data.usuario[0].nombre_solicitante,
      telefono_solicitante: data.usuario[0].telefono_solicitante,
      correo_solicitante: data.usuario[0].correo_solicitante,
      rut_solicitante: data.usuario[0].rut_solicitante,

      //sector
      direccion_solicitante: data.sector[0].direccion_solicitante,
      //sector_solicitante: data.sector[0].sector_solicitante,
      //poblacion_solicitante: data.sector[0].poblacion_solicitante,
      // junta_vecinos: data.sector[0].junta_vecinos,

      //solicitud
      descripcion_solicitud: data.solicitud[0].descripcion_solicitud,
      observaciones_solicitud: data.solicitud[0].observaciones_solicitud,
      medidas_seguridad: data.solicitud[0].medidas_seguridad,
      espacios_publicos: data.solicitud[0].espacios_publicos,

      //procesos
      fecha_solicitud: formattedFecha,
      estado_solicitud: data.proceso[0].estado_solicitud,
      responsable_solicitud: data.proceso[0].responsable_solicitud,
      medio_atencion: data.proceso[0].medio_atencion,
      tipo_solicitud: data.proceso[0].tipo_solicitud,
      temas_atencion: data.proceso[0].temas_atencion,
    });
    setSelectedSector(data.sector[0].sector_solicitante);
    setSelectedPobla(data.sector[0].poblacion_solicitante);
    setSelectedJJVV(data.sector[0].junta_vecinos);
  };

  const handleChanges = async (e) => {
    const { name, value } = e.target;
    setAtenciones({ ...atenciones, [name]: value });
    //console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const decoded = jwtDecode(token);
    const user_decoded = decoded.user_name;
    const confirmar = window.confirm("¿Deseas guardar los cambios?");
    if (!confirmar) return;

    const sectorFormateado = JSON.stringify(selectedSector);
    const poblaFormateada = JSON.stringify(selectedPobla);
    const jjvvFormateada = JSON.stringify(selectedJJVV);
    const datosAtencion = {
      ...atenciones,
      sector_solicitante: selectedSector,
      poblacion_solicitante: selectedPobla,
      junta_vecinos: selectedJJVV,
      user_creador: user_decoded,
    };

    try {
      const idAten = params.id;
      const url = idAten
        ? `${servidor}/atenciones/${params.id}`
        : `${servidor}/atenciones/sgc`;
      const method = idAten ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(datosAtencion),
      });
      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const lastAtencionData = await fetch(`${servidor}/atenciones/sgc/last`);

      const lastAtencion = await lastAtencionData.json();
      setLastId(lastAtencion.atencion_ciudadana.id_atencion);
      if (lastAtencion && lastAtencion.atencion_ciudadana) {
        const idAtencionFinal =
          lastAtencion.atencion_ciudadana.atencion_ciudadana;
        navigate(`/sgc/atencion/${idAtencionFinal + 1}`);
      }

      const metodo = idAten ? "" : `/sgc/atencion/${lastId + 1}`;
      navigate(metodo);
      setEditing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ mesasge: "Problemas de conexión con el servidor" });
    }
    setEditing(true);
  };

  const handleFirstAten = async () => {
    const res = await fetch(`${servidor}/atenciones/sgc/first`);
    if (res.ok) {
      const firstAten = await res.json();
      if (firstAten) {
        const id_aten = firstAten.atencion_ciudadana[0].id_atencion;
        navigate(`/sgc/atencion/${id_aten}`);
      } else {
        console.log("no se encuentran registros");
      }
    } else {
      console.log("Error obteniendo registros");
    }
  };

  const handleLastAten = async () => {
    const res = await fetch(`${servidor}/atenciones/sgc/last`);
    if (res.ok) {
      const lastAten = await res.json();
      if (lastAten) {
        const id_aten = lastAten.atencion_ciudadana.id_atencion;
        navigate(`/sgc/atencion/${id_aten}`);
      } else {
        console.log("No hay registros");
      }
    } else {
      console.log("Error obteniendo datos");
    }
  };

  const handleCancel = async () => {
    const id = params.id;

    try {
      if (!id) handleLastAten();
      loadAtenciones(id);

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = async () => {
    const id = params.id;
    try {
      const response = await fetch(`${servidor}/atenciones/${id}/sgc/prev`);
      const data = await response.json();

      if (
        data?.atencion_ciudadana?.length > 0 &&
        data.atencion_ciudadana[0].id_atencion
      ) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/sgc/atencion/${data.atencion_ciudadana[0].id_atencion}`);
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
    const id = params.id;
    try {
      const response = await fetch(`${servidor}/atenciones/${id}/sgc/next`);
      const data = await response.json();

      if (
        data?.atencion_ciudadana?.length > 0 &&
        data.atencion_ciudadana[0].id_atencion
      ) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/sgc/atencion/${data.atencion_ciudadana[0].id_atencion}`);
        //setDisabledNextButton(false);
      } else {
        // setDisabledPrevButton(true);
        console.log("No hay registro anterior.");
      }
    } catch (error) {
      console.error("Error al obtener registro:", error);
    }
  };

  const handleNewAten = () => {
    setSelectedPobla("");
    setSelectedSector("");
    setSelectedJJVV("");
    navigate("/sgc/atencion/new");
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = async () => {
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAten = async () => {
    const eliminar = window.confirm("¿Deseas eliminar el informe?");
    if (!eliminar) return;

    const id = params.id;
    await fetch(`${servidor}/atenciones/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedAten = { ...atenciones };
    delete updatedAten[id];
    setAtenciones(updatedAten);

    const res = await fetch(`${servidor}/atenciones/sgc/last`);
    const data = await res.json();
    navigate(`/sgc/atencion/${data.atencion_ciudadana.id_atencion}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleFirstAten}
          disabled={
            //disabledPrevButton
            false
          }
        >
          <i className="bi bi-skip-start me-1"></i> Primer registro
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
          <i className="bi bi-chevron-left me-1"></i> Atrás
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
          onClick={handleLastAten}
          disabled={
            false
            //disabledNextButton
          }
        >
          Último registro <i className="bi bi-skip-end ms-1"></i>
        </button>
      </div>
      {/* <input
        type="text"
        name="id_atencion"
        value={atenciones.cod_atencion}
        disabled
      />*/}

      <div className="row">
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white d-flex justify-content-between">
              <div>
                <strong>Código atención: {atenciones.cod_atencion}</strong>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="was-validated">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Fecha Solicitud</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="fecha_solicitud"
                      id=""
                      onChange={handleChanges}
                      value={atenciones.fecha_solicitud}
                      disabled={editing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Estado de la solicitud</label>
                    <select
                      className="form-select"
                      name="estado_solicitud"
                      id=""
                      onChange={handleChanges}
                      value={atenciones.estado_solicitud}
                      disabled={editing}
                      required
                    >
                      <option value="">Seleccione estado</option>
                      <option value="en proceso">En proceso</option>
                      <option value="en seguimiento">En seguimiento</option>
                      <option value="visitado">Visitado</option>
                      <option value="atendido">Atendido</option>
                      <option value="derivado">Derivado</option>
                      <option value="desistido">Desistido</option>
                      <option value="anulado">Anulado</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Responsable atención</label>
                    <select
                      name="responsable_solicitud"
                      className="form-select"
                      id=""
                      onChange={handleChanges}
                      value={atenciones.responsable_solicitud}
                      disabled={editing}
                      required
                    >
                      <option value="">Seleccione responsable</option>
                      <option value="giordana">María Giordana Ortiz</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Medio de atención</label>
                    <select
                      name="medio_atencion"
                      className="form-select"
                      id=""
                      onChange={handleChanges}
                      value={atenciones.medio_atencion}
                      disabled={editing}
                      required
                    >
                      <option value="">Seleccione el medio de atención</option>
                      <option value="">Seleccione opción</option>
                      <option value="CCSP">CCSP</option>
                      <option value="e-mail">E-mail</option>
                      <option value="memorandum">Memorandum/Oficio</option>
                      <option value="presencial">Presencial</option>
                      <option value="radio">Radio</option>
                      <option value="reunion">Reunión Oficina</option>
                      <option value="rrss">RRSS</option>
                      <option value="telefono">Teléfono</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tipo de solicitud</label>
                    <select
                      className="form-select"
                      name="tipo_solicitud"
                      id=""
                      onChange={handleChanges}
                      value={atenciones.tipo_solicitud}
                      disabled={editing}
                      required
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="asesoria">Asesoría</option>
                      <option value="consulta">Consulta información</option>
                      <option value="denuncia">Denuncia</option>
                      <option value="mesa trabajo">Mesa de trabajo</option>
                      <option value="peticion">Petición</option>
                      <option value="prevencion">Prevención situacional</option>
                      <option value="propuesta">Propuesta</option>
                      <option value="queja">Queja</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="tramite">Trámite</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Temas de la atención</label>
                    <textarea
                      name="temas_atencion"
                      className="form-control"
                      rows="3"
                      id=""
                      onChange={handleChanges}
                      value={atenciones.temas_atencion}
                      readOnly={editing}
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Rut usuario</label>
                    <input
                      className="form-control"
                      type="text"
                      name="rut_solicitante"
                      onChange={handleChanges}
                      value={atenciones.rut_solicitante}
                      readOnly={editing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nombre solicitante</label>
                    <input
                      className="form-control"
                      type="text"
                      name="nombre_solicitante"
                      onChange={handleChanges}
                      value={atenciones.nombre_solicitante}
                      readOnly={editing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      className="form-control"
                      type="text"
                      name="telefono_solicitante"
                      onChange={handleChanges}
                      value={atenciones.telefono_solicitante}
                      readOnly={editing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Correo eléctronico</label>
                    <input
                      className="form-control"
                      type="email"
                      name="correo_solicitante"
                      onChange={handleChanges}
                      value={atenciones.correo_solicitante}
                      readOnly={editing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Dirección</label>
                    <input
                      className="form-control"
                      type="text"
                      name="direccion_solicitante"
                      onChange={handleChanges}
                      value={atenciones.direccion_solicitante}
                      readOnly={editing}
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
                    <label className="form-label">Población</label>
                    <SelectPoblacion
                      selectedPobla={selectedPobla}
                      setSelectedPobla={setSelectedPobla}
                      edition={editing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Junta de vecinos</label>
                    <SelectJJVV
                      selectedJJVV={selectedJJVV}
                      setSelectedJJVV={setSelectedJJVV}
                      edition={editing}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Descripcion de la solicitud
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      name="descripcion_solicitud"
                      id=""
                      onChange={handleChanges}
                      value={atenciones.descripcion_solicitud}
                      readOnly={editing}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Observaciones</label>
                    <textarea
                      className="form-control"
                      name="observaciones_solicitud"
                      rows={3}
                      id=""
                      onChange={handleChanges}
                      value={atenciones.observaciones_solicitud}
                      readOnly={editing}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Medidas de seguridad implementadas
                    </label>
                    <textarea
                      className="form-control"
                      name="medidas_seguridad"
                      rows={3}
                      id=""
                      onChange={handleChanges}
                      value={atenciones.medidas_seguridad}
                      readOnly={editing}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Espacios públicos involucrados
                    </label>
                    <textarea
                      className="form-control"
                      name="espacios_publicos"
                      rows={3}
                      id=""
                      onChange={handleChanges}
                      value={atenciones.espacios_publicos}
                      readOnly={editing}
                    ></textarea>
                  </div>
                </div>

                {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {!editing && (
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Guardar Informe
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-danger"
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
                    onClick={handleNewAten}
                  >
                    <i className="bi bi-clipboard2-plus"></i> Nueva atención
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
                    onClick={handleDeleteAten}
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
                  onClick={() => SCAtencionPDF(params.id)}
                >
                  <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
                </button>
              )}
            </div>
          </div>
        </div>
        {params.id ? (
          <>
            <div className="col-lg-5">
              <FormAcciones tipo={"seguridad"} />
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      <div className="row mt-4">
        <AttachFiles idInforme={atenciones.cod_atencion} />
      </div>
    </div>
  );
}

export default FormAtencion;
