import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectVehiculo from "../SelectVehiculo";
import SelectTripulantes from "../SelectTripulantes";
import SelectOrigin from "../SelectOrigin";
import SelectInformante from "../SelectInformante";
import SelectTipo from "../SelectTipo";
import SelectSector from "../SelectSector";
import ListPendiente from "../ListPendiente";
import AttachFiles from "../AttachFiles";

import CentralPDF from "../PDFs/CentralPDF";
import SelectRecursos from "../SelectRecursos";
import SelectClasifica from "../SelectClasifica";
import FormAcciones from "../FormAcciones";
import { jwtDecode } from "jwt-decode";

function FormInformes() {
  const params = useParams();
  const navigate = useNavigate();

  const defaultInformes = {
    //origen informe
    fecha_informe: "",
    origen_informe: "",
    persona_informante: "",
    captura_informe: "",
    clasificacion_informe: "",
    estado_informe: "",

    //tipos informe
    tipo_informe: "",
    otro_tipo: "",
    descripcion_informe: "",
    recursos_informe: "",

    //ubicacion informe

    sector_informe: "",
    direccion_informe: "",

    //datos vehiculos
    vehiculos_informe: "",
    tripulantes_informe: "",

    //informes
    id_informes_central: "",
    id_origen_informe: "",
    id_tipos_informe: "",
    id_ubicacion_informe: "",
    id_vehiculo_informe: "",
  };

  const [informes, setInformes] = useState(defaultInformes);
  const [lastId, setLastId] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState([]);
  const [selectedTripulante, setSelectedTripulante] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedInformante, setSelectedInformante] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedRecursos, setSelectedRecursos] = useState([]);
  const [selectedClasif, setSelectedClasif] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editing, setEditing] = useState(true);

  const { originRef, clasiRef, informanteRef, tipoRef, recursoRef, sectorRef } =
    useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (params.id) {
      loadInformes(params.id);
    } else {
      setInformes(defaultInformes);
    }
  }, [params.id]);

  const loadInformes = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informes_central/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    /*const recursosFormateados = data.informe[0].recursos_informe
      ? data.informe[0].recursos_informe.split(",").map((item) => item.trim()) // Elimina espacios extra
      : [];*/

    //console.log("Recursos formateados:", recursosFormateados);
    console.log(data);

    setInformes({
      //informes
      id_informes_central: params.id,
      id_origen_informe: data.informe[0].id_origen_informe,
      id_tipos_informe: data.informe[0].id_tipos_informe,
      id_ubicacion_informe: data.informe[0].id_ubicacion_informe,
      id_vehiculo_informe: data.informe[0].id_vehiculo_informe,
      cod_informes_central: data.informe[0].cod_informes_central,
      fecha_doc_central: data.informe[0].fecha_doc_central,
      user_creador: data.informe[0].user_creador,
      //origen informe
      fecha_informe: dayjs(data.informe[0].fecha_informe).format(
        "YYYY-MM-DDTHH:mm"
      ),
      //origen_informe: data.informe[0].origen_informe,
      //origen_informe: setSelectedOrigin(data.informe[0].origen_informe),
      //persona_informante: data.informe[0].persona_informante,
      captura_informe: data.informe[0].captura_informe,
      //clasificacion_informe: data.informe[0].clasificacion_informe,
      estado_informe: data.informe[0].estado_informe,

      //tipos informe

      tipo_informe: data.informe[0].tipo_informe,
      otro_tipo: data.informe[0].otro_tipo,
      descripcion_informe: data.informe[0].descripcion_informe,

      //ubicacion informe

      //sector_informe: data.informe[0].sector_informe,
      direccion_informe: data.informe[0].direccion_informe,

      //datos vehiculos

      //vehiculos_informe: vehiculosFormateados,
      //tripulantes_informe: data.informe[0].tripulantes_informe,
    });

    setSelectedInformante(data.informe[0].persona_informante);
    setSelectedOrigin(data.informe[0].origen_informe);
    setSelectedTipo(data.informe[0].tipo_informe);
    setSelectedSector(data.informe[0].sector_informe);
    setSelectedVehiculo(data.informe[0].vehiculos_informe);
    setSelectedTripulante(data.informe[0].tripulantes_informe);
    setSelectedClasif(data.informe[0].clasificacion_informe);
    setSelectedRecursos(data.informe[0].recursos_informe);

    //setSelectedValues(recursosFormateados);
    console.log("clasificacion", data.informe[0].clasificacion_informe);
    console.log("recursos", data.informe[0].recursos_informe);
  };

  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    setInformes({ ...informes, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const decoded = jwtDecode(token);
    const user_decoded = decoded.user_name;
    const confirmar = window.confirm("¿Deseas guardar los cambios?");
    if (!confirmar) return;

    setRefresh((prev) => !prev);

    const vehiculosFormateados = JSON.stringify(selectedVehiculo);
    const tripuFormateado = JSON.stringify(selectedTripulante);
    const originFormateado = JSON.stringify(selectedOrigin);
    const informanteFormateado = JSON.stringify(selectedInformante);
    const tipoFormateado = JSON.stringify(selectedTipo);
    const sectorFormateado = JSON.stringify(selectedSector);
    const recursosFormateado = JSON.stringify(selectedRecursos);
    const clasificaFormateado = JSON.stringify(selectedClasif);
    const datosActualizados = {
      ...informes,
      sector_informe: sectorFormateado,
      tipo_informe: tipoFormateado,
      persona_informante: informanteFormateado,
      origen_informe: originFormateado,
      vehiculos_informe: vehiculosFormateados,
      tripulantes_informe: tripuFormateado,
      clasificacion_informe: clasificaFormateado,
      recursos_informe: recursosFormateado,
      user_creador: user_decoded,
    };
    //setSelectedValues(arrayFormateado);
    //console.log("Datos enviados", informes);
    //console.log("Datos a enviar:", JSON.stringify(datosActualizados, null, 2));

    try {
      const url = params.id
        ? `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informes_central/${
            params.id
          }`
        : `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informes_central`;

      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosActualizados),
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      if (!params.id) {
        const lastData = await fetch(
          `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/last`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const lastInforme = await lastData.json();

        if (lastInforme && lastInforme.informe[0]) {
          const lastIdInfo = lastInforme.informe[0].id_informes_central;
          setLastId(lastIdInfo); // Actualizar el estado (aunque es asíncrono)

          // Navegar a la nueva ruta
          navigate(`/informes/central/${lastIdInfo}`);
        }
      }
    } catch (error) {
      console.error(error);
    }

    setEditing(true);
  };

  const handleFirstInforme = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/first`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const firstInforme = await res.json();
      if (firstInforme) {
        const id_informe = firstInforme.informe[0].id_informes_central;
        console.log(firstInforme);
        navigate(`/informes/central/${id_informe}`);
      } else {
        console.log("No hay informes");
      }
    } else {
      console.log("Error al obtener informes");
    }
  };

  const handleLastInforme = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/last`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const lastInforme = await res.json();
      if (lastInforme) {
        const id_informe = lastInforme.informe[0].id_informes_central;
        navigate(`/informes/central/${id_informe}`);
      } else {
        console.log("No hay informes");
      }
    } else {
      console.log("Error al obtener informes");
    }
  };

  const handlePrevious = async () => {
    const id = params.id;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/${id}/prev`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      //console.log(data.informe[0].id_informes_central);
      const idInforme = data.informe[0].id_informes_central;
      if (data?.informe?.length > 0) {
        navigate(`/informes/central/${idInforme}`);
      } else {
        console.log("No existen registros anteriores");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = async () => {
    const id = params.id;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/${id}/next`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const idInforme = data.informe[0].id_informes_central;
      console.log(data.informe[0].id_informes_central);
      if (data?.informe?.length > 0 && idInforme) {
        navigate(`/informes/central/${idInforme}`);
      } else {
        console.log("No existen registros");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewInform = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/informes/new");
    setSelectedTripulante("");
    setSelectedVehiculo("");
    setSelectedValues("");
    setSelectedOrigin("");
    setSelectedInformante("");
    setSelectedSector("");
    setSelectedTipo("");
    setSelectedClasif("");
    setSelectedRecursos("");
    setEditing(false);
  };

  const handleEdit = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(false);
  };

  const handleCancel = async () => {
    const id = params.id;

    try {
      if (!id) handleLastInforme();
      loadInformes(id);

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteInforme = async () => {
    const eliminar = window.confirm("¿Deseas eliminar el informe?");
    if (!eliminar) return;

    const id = params.id;

    await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informes_central/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedInforme = { ...informes };
    delete updatedInforme[id];
    setInformes(updatedInforme);

    const res = await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/last`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    const idInforme = data.informe[0].id_informes_central;
    navigate(`/informes/central/${idInforme}`);
  };

  //verificar rol usuario y cambiar variable rolUser

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          <button
            className="btn btn-outline-primary"
            onClick={handleFirstInforme}
            disabled={!editing}
          >
            <i className="bi bi-skip-start me-1"></i> Primer Informe
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={handlePrevious}
            disabled={!editing}
          >
            <i className="bi bi-chevron-left me-1"></i> Atrás
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={handleNext}
            disabled={!editing}
          >
            Siguiente <i className="bi bi-chevron-right ms-1"></i>
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={handleLastInforme}
            disabled={!editing}
          >
            Último Informe <i className="bi bi-skip-end ms-1"></i>
          </button>
        </div>

        <div className="row">
          <div className="col-lg-7">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-success text-white d-flex justify-content-between">
                <strong>Código informe: {informes.cod_informes_central}</strong>
                <div>
                  <small className="fw-semibold">Creado: </small>
                  <small className="fst-italic">
                    {dayjs(informes.fecha_doc_central).format(
                      "DD-MM-YYYY HH:mm"
                    )}
                  </small>
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit} className="was-validated">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Fecha de informe</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_informe"
                        onChange={handleChanges}
                        value={informes.fecha_informe}
                        readOnly={editing}
                        required
                      />
                      <div className="invalid-feedback">Ingrese fecha</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Origen de la información
                      </label>
                      <SelectOrigin
                        {...{
                          edition: editing,
                          selectedOrigin,
                          setSelectedOrigin,

                          selectRef: originRef,
                        }}
                      />
                    </div>
                    <div className="invalid-feedback">Ingrese Origen</div>

                    <div className="col-md-6">
                      <label className="form-label">Persona informante</label>
                      <SelectInformante
                        {...{
                          edition: editing,
                          selectedInformante,
                          setSelectedInformante,

                          selectRef: informanteRef,
                        }}
                      />
                    </div>
                    <div className="invalid-feedback">
                      Ingrese al informante
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Clasificación</label>
                      <SelectClasifica
                        {...{
                          selectedClasif,
                          setSelectedClasif,
                          edition: editing,

                          selectRef: clasiRef,
                        }}
                      />
                    </div>
                    <div className="invalid-feedback">
                      Ingrese clasificación del informe
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Captura del informe</label>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          "radios",
                          "telefono",
                          "rrss",
                          "presencial",
                          "email",
                        ].map((tipo) => (
                          <div className="form-check" key={tipo}>
                            <input
                              type="radio"
                              className="form-check-input"
                              id={tipo}
                              name="captura_informe"
                              value={tipo}
                              onChange={handleChanges}
                              checked={informes.captura_informe === tipo}
                              disabled={editing}
                              required
                            />
                            <label className="form-check-label" htmlFor={tipo}>
                              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="invalid-feedback">
                        Ingrese Medio de captura
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Estado del informe</label>
                      <div className="d-flex flex-wrap gap-2">
                        {["atendido", "progreso", "pendiente"].map((estado) => (
                          <div className="form-check" key={estado}>
                            <input
                              type="radio"
                              className="form-check-input"
                              id={estado}
                              name="estado_informe"
                              value={estado}
                              onChange={handleChanges}
                              checked={informes.estado_informe === estado}
                              disabled={editing}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor={estado}
                            >
                              {estado.charAt(0).toUpperCase() + estado.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="invalid-feedback">
                        Ingrese estado del informe
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tipo de informe</label>
                      <SelectTipo
                        {...{
                          selectedTipo,
                          setSelectedTipo,
                          tipo: selectedClasif,
                          edition: editing,

                          selectRef: tipoRef,
                        }}
                      />
                    </div>
                    <div className="invalid-feedback">
                      Ingrese tipo de informe
                    </div>

                    {informes.tipo_informe === "Otro" && (
                      <div className="col-md-6">
                        <label className="form-label">
                          Otro tipo de informe
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="otro_tipo"
                          onChange={handleChanges}
                          value={informes.otro_tipo}
                          readOnly={editing}
                        />
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="descripcion_informe"
                        onChange={handleChanges}
                        value={informes.descripcion_informe}
                        readOnly={editing}
                      ></textarea>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">
                        Recursos involucrados
                      </label>
                      <SelectRecursos
                        {...{
                          selectedRecursos,
                          setSelectedRecursos,
                          edition: editing,

                          selectRef: recursoRef,
                        }}
                      />
                    </div>
                    <div className="invalid-feedback">
                      Ingrese recursos involucrados
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Sector</label>
                      <SelectSector
                        {...{
                          selectedSector,
                          setSelectedSector,
                          edition: editing,

                          selectRef: sectorRef,
                        }}
                      />
                    </div>
                    <div className="invalid-feedback">
                      Ingrese sector asociado a informe
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        name="direccion_informe"
                        onChange={handleChanges}
                        value={informes.direccion_informe}
                        readOnly={editing}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Vehículos</label>
                      <SelectVehiculo
                        {...{
                          selectedVehiculo,
                          setSelectedVehiculo,
                          edition: editing,
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tripulantes</label>
                      <SelectTripulantes
                        {...{
                          selectedTripulante,
                          setSelectedTripulante,
                          edition: editing,
                        }}
                      />
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="d-flex flex-wrap gap-2 mt-4 ">
                    {!editing && (
                      <div className="d-flex flex-wrap gap-2 mt-4">
                        <button type="submit" className="btn btn-primary">
                          <i className="bi bi-save"></i> Guardar
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
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
                      type="button"
                      className="btn btn-success"
                      onClick={handleNewInform}
                    >
                      <i className="bi bi-clipboard2-plus"></i> Nuevo
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
                      onClick={handleDeleteInforme}
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
                    onClick={() => CentralPDF(params.id)}
                  >
                    <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            {selectedClasif.value === 1 && params.id && (
              <FormAcciones tipo="central" />
            )}
            {editing && <ListPendiente refresh={refresh} />}
          </div>
        </div>

        {editing && (
          <div className="row mt-4">
            <AttachFiles idInforme={params.id} />
          </div>
        )}
      </div>
    </>
  );
}

export default FormInformes;
