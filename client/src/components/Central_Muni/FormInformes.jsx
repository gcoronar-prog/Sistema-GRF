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
import { useTokenSession } from "../useTokenSession";

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
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({});

  const { originRef, clasiRef, informanteRef, tipoRef, recursoRef, sectorRef } =
    useRef(null);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  useEffect(() => {
    useTokenSession(setUserData);

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    const newErrors = {};

    if (!selectedOrigin) newErrors.origin = true;
    if (!selectedClasif) newErrors.clasif = true;
    if (!selectedInformante) newErrors.informante = true;
    if (!selectedTipo) newErrors.tipo = true;
    if (!selectedRecursos) newErrors.recurso = true;
    if (!selectedSector) newErrors.sector = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const confirmar = window.confirm("¿Deseas guardar los cambios?");
      if (!confirmar) return; // Si el usuario cancela, no sigue
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
      };
      //setSelectedValues(arrayFormateado);
      console.log("Datos enviados", informes);
      console.log(
        "Datos a enviar:",
        JSON.stringify(datosActualizados, null, 2)
      );

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    } else {
      if (newErrors.origin) originRef.current?.focus();
      else if (newErrors.clasif) clasiRef.current?.focus();
      else if (newErrors.informante) informanteRef.current?.focus();
      else if (newErrors.tipo) tipoRef.current?.focus();
      else if (newErrors.recurso) recursoRef.current?.focus();
      else if (newErrors.sector) sectorRef.current?.focus();
    }
  };

  const handleFirstInforme = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/first`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    setErrors(false);
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    const idInforme = data.informe[0].id_informes_central;
    navigate(`/informes/central/${idInforme}`);
  };

  //verificar rol usuario y cambiar variable rolUser

  document.body.style = "background:rgb(236, 241, 241);";
  return (
    <>
      <div className="container-fluid mt-4 w-100">
        <div className="d-flex flex-wrap align-items-center gap-2 my-3">
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={handleFirstInforme}
            disabled={
              //disabledPrevButton
              !editing
            }
          >
            <i className="bi bi-skip-start me-1"></i> Primer Informe
          </button>
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={handlePrevious}
            disabled={
              //disabledPrevButton
              !editing
            }
          >
            <i className="bi bi-chevron-left me-1"></i> Atras
          </button>
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={handleNext}
            disabled={
              //disabledNextButton
              !editing
            }
          >
            Siguiente <i className="bi bi-chevron-right ms-1"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={handleLastInforme}
            disabled={
              !editing
              //disabledNextButton
            }
          >
            Ultimo Informe <i className="bi bi-skip-end ms-1"></i>
          </button>
        </div>
        <br />

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header text-bg-success">
                <span className="form-label fw-bold">
                  Código informe: {informes.cod_informes_central}
                </span>
                {"      ||      "}
                <span className="form-label fw-bold">
                  Fecha creación:{" "}
                  {dayjs(informes.fecha_doc_central).format("DD-MM-YYYY HH:mm")}
                </span>
              </div>
              <div className="card-body">
                <form
                  action=""
                  onSubmit={handleSubmit}
                  className="was-validated"
                >
                  <div className="row g-3 mb-4">
                    <div className="col-md-5">
                      <label htmlFor="fecha_informe" className="form-label">
                        Fecha de informe:
                      </label>
                      <input
                        id="fecha_informe"
                        className="form-control"
                        type="datetime-local"
                        name="fecha_informe"
                        onChange={handleChanges}
                        value={informes.fecha_informe}
                        readOnly={editing}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="origen_informe" className="form-label">
                        Origen de la información
                      </label>
                      <SelectOrigin
                        id="origen_informe"
                        edition={editing}
                        selectedOrigin={selectedOrigin}
                        setSelectedOrigin={setSelectedOrigin}
                        error={errors.origin}
                        selectRef={originRef}
                      />
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="persona_informante"
                        className="form-label"
                      >
                        Persona informante
                      </label>
                      <SelectInformante
                        id="persona_informante"
                        edition={editing}
                        selectedInformante={selectedInformante}
                        setSelectedInformante={setSelectedInformante}
                        error={errors.informante}
                        selectRef={informanteRef}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <label className="form-label d-block">
                          Captura del informe:
                        </label>
                        <div className="d-flex flex-wrap gap-3">
                          {[
                            "radios",
                            "telefono",
                            "rrss",
                            "presencial",
                            "email",
                          ].map((tipo) => (
                            <div className="col">
                              <div className="form-check form-check" key={tipo}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="captura_informe"
                                  id={tipo}
                                  value={tipo}
                                  checked={informes.captura_informe === tipo}
                                  onChange={handleChanges}
                                  disabled={editing}
                                  required
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={tipo}
                                >
                                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="persona_informante"
                        className="form-label"
                      >
                        Clasificación
                      </label>
                      <SelectClasifica
                        id="clasificacion"
                        selectedClasif={selectedClasif}
                        setSelectedClasif={setSelectedClasif}
                        edition={editing}
                        error={errors.clasif}
                        selectRef={clasiRef}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label d-block">
                        Estado del informe:
                      </label>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="estado_informe"
                            id="atendido"
                            onChange={handleChanges}
                            value={"atendido"}
                            checked={informes.estado_informe === "atendido"}
                            disabled={editing}
                            required
                          />
                          <label
                            htmlFor="atendido"
                            className="form-check-label"
                          >
                            Atendido
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="estado_informe"
                            id="progreso"
                            onChange={handleChanges}
                            value={"progreso"}
                            checked={informes.estado_informe === "progreso"}
                            disabled={editing}
                          />
                          <label
                            htmlFor="progreso"
                            className="form-check-label"
                          >
                            En progreso
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="estado_informe"
                            id="pendiente"
                            onChange={handleChanges}
                            value={"pendiente"}
                            checked={informes.estado_informe === "pendiente"}
                            disabled={editing}
                          />
                          <label
                            htmlFor="pendiente"
                            className="form-check-label"
                          >
                            Pendiente
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8">
                      <label htmlFor="tipoInforme" className="form-label">
                        Tipo de informe
                      </label>
                      <SelectTipo
                        id="tipoInforme"
                        edition={editing}
                        selectedTipo={selectedTipo}
                        setSelectedTipo={setSelectedTipo}
                        tipo={selectedClasif}
                        error={errors.tipo}
                        selectRef={tipoRef}
                      />
                    </div>

                    {informes.tipo_informe == "Otro" ? (
                      <>
                        <label htmlFor="otroTipo" className="form-label">
                          Otro tipo de informe:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="otro_tipo"
                          id="otroTipo"
                          onChange={handleChanges}
                          value={informes.otro_tipo}
                          readOnly={editing}
                        />
                      </>
                    ) : (
                      ""
                    )}

                    <div className="w-25,">
                      <label htmlFor="descripcion" className="form-label">
                        Descripción:
                      </label>
                      <textarea
                        className="form-control"
                        name="descripcion_informe"
                        id="descripcion"
                        onChange={handleChanges}
                        value={informes.descripcion_informe}
                        readOnly={editing}
                      ></textarea>
                    </div>

                    <div className="col-md-9">
                      <label htmlFor="recursosInvo" className="form-label">
                        Recursos Involucrados:
                      </label>
                      <SelectRecursos
                        id="recursosInvo"
                        edition={editing}
                        selectedRecursos={selectedRecursos}
                        setSelectedRecursos={setSelectedRecursos}
                        error={errors.recurso}
                        selectRef={recursoRef}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="sector" className="form-label">
                        Sector:
                      </label>
                      <SelectSector
                        id="sector"
                        edition={editing}
                        selectedSector={selectedSector}
                        setSelectedSector={setSelectedSector}
                        error={errors.sector}
                        selectRef={sectorRef}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="direccion" className="form-label">
                        Dirección:
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="direccion_informe"
                        id="direccion"
                        onChange={handleChanges}
                        value={informes.direccion_informe}
                        readOnly={editing}
                      />
                    </div>

                    <div className="col-md-8">
                      <label htmlFor="vehiculos" className="form-label">
                        Ingrese vehículos
                      </label>
                      <SelectVehiculo
                        id="vehiculos"
                        edition={editing}
                        selectedVehiculo={selectedVehiculo}
                        setSelectedVehiculo={setSelectedVehiculo}
                      />
                    </div>

                    <div className="col-md-8">
                      <label htmlFor="tripu" className="form-label">
                        Ingrese Tripulantes
                      </label>
                      <SelectTripulantes
                        id="tripu"
                        edition={editing}
                        selectedTripulante={selectedTripulante}
                        setSelectedTripulante={setSelectedTripulante}
                      />
                    </div>
                  </div>

                  {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleNewInform}
                      style={{ display: editing ? "" : "none" }}
                    >
                      <i className="bi bi-clipboard2-plus"></i> Nuevo Expediente
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleEdit}
                      style={{ display: editing ? "" : "none" }}
                    >
                      <i className="bi bi-pencil-square"></i> Editar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ display: editing ? "none" : "" }}
                    >
                      Guardar Informe
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ display: editing ? "none" : "" }}
                      onClick={handleCancel}
                    >
                      <i className="bi bi-x-octagon"></i> Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ display: editing ? "" : "none" }}
                      onClick={handleDeleteInforme}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => CentralPDF(params.id)}
                >
                  <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            {selectedClasif.value === 1 && params.id ? (
              <FormAcciones tipo="central" />
            ) : (
              ""
            )}

            <ListPendiente refresh={refresh} />
          </div>
        </div>
        <hr />
        <div className="row">
          {editing ? <AttachFiles idInforme={params.id} /> : ""}
        </div>
      </div>
    </>
  );
}

export default FormInformes;
