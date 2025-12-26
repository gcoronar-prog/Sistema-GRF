import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlobProvider } from "@react-pdf/renderer";
import AlfaPDF from "../PDFs/AlfaPDF";
import { useTokenSession } from "../useTokenSession";

function FormAlfa() {
  const params = useParams();
  const navigate = useNavigate();
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");
  const user = useTokenSession();

  const [informesALFA, setInformesALFA] = useState({
    fuente: "I. Municipalidad de San Antonio",
    fono: "352337133",
    sismo_escala: "",
    tipo_evento: [],
    otro_evento: "",
    descripcion: "",
    ocurrencia: "",
    acciones: "",
    oportunidad_tpo: "",
    recursos_involucrados: "",
    evaluacion_necesidades: "",
    capacidad_respuesta: "",
    observaciones: "",
    usuario_grd: "",
    fecha_hora: "",

    daños_vivienda: "",
    daños_infra: "",
    daños_personas: {
      afectadas: { hombres: "", mujeres: "" },
      damnificadas: { hombres: "", mujeres: "" },
      heridas: { hombres: "", mujeres: "" },
      muertes: { hombres: "", mujeres: "" },
      desaparecidas: { hombres: "", mujeres: "" },
      albergados: { hombres: "", mujeres: "" },
    },
    monto_estimado: "",
    cod_alfa_daños: "",

    region: "V Región",
    provincia: "San Antonio",
    comuna: "San Antonio",
    direccion: "",
    tipo_ubicacion: "",
    cod_alfa_sector: "",
  });

  const [funcionarios, setFuncionarios] = useState([]);
  const [editing, setEditing] = useState(true);
  const [selectedValues, setSelectedValues] = useState([]);
  const [lastIdAlfa, setLastIdAlfa] = useState(null);
  const [disabledPrevButton, setDisabledPrevButton] = useState(false);
  const [disabledNextButton, setDisabledNextButton] = useState(false);

  useEffect(() => {
    loadFuncionario();
  }, []);

  useEffect(() => {
    if (params.id) {
      loadInformes(params.id);
    } else {
      setInformesALFA(defaultInformes);
      setSelectedValues("");
    }
  }, [params.id]);

  const loadFuncionario = async () => {
    const res = await fetch(`${servidor_local}/funciongrd`);
    if (!res.ok) throw new Error("Problemas obteniendo datos inspectores");
    const data = await res.json();
    setFuncionarios(data);
  };

  const loadInformes = async (id) => {
    const res = await fetch(`${servidor_local}/alfa/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Problemas obteniendo datos de informes");
    const data = await res.json();
    console.log("alfa", data);

    const info = data;
    const formattedOcurrencia = dayjs(info.informes.ocurrencia).format(
      "YYYY-MM-DDTHH:mm"
    );
    const formattedFechaHora = dayjs(info.informes.fecha_hora).format(
      "YYYY-MM-DDTHH:mm"
    );

    //console.log(data.informes[0].cod_alfa);

    setInformesALFA({
      fuente: info.informes.fuente,
      fono: info.informes.fono,
      sismo_escala: info.informes.sismo_escala,
      tipo_evento: info.informes.tipo_evento,
      otro_evento: info.informes.otro_evento,
      descripcion: info.informes.descripcion,
      ocurrencia: formattedOcurrencia,
      //ocurrencia: info.informes[0].ocurrencia,
      acciones: info.informes.acciones,
      oportunidad_tpo: info.informes.oportunidad_tpo,
      recursos_involucrados: info.informes.recursos_involucrados,
      evaluacion_necesidades: info.informes.evolucion_necesidades,
      capacidad_respuesta: info.informes.capacidad_respuesta,
      observaciones: info.informes.observaciones,
      usuario_grd: info.informes.usuario_grd,
      fecha_hora: formattedFechaHora,
      //fecha_hora: info.informes[0].fecha_hora,
      otras_necesidades: info.informes.otras_necesidades,

      daños_vivienda: info.danios.daños_vivienda,
      daños_infra: info.danios.daños_infra,
      daños_personas: info.danios.daños_personas,
      monto_estimado: info.danios.monto_estimado,
      cod_alfa_daños: info.danios.cod_alfa_daños,

      region: info.sectores.region,
      provincia: info.sectores.provincia,
      comuna: info.sectores.comuna,
      direccion: info.sectores.direccion,
      tipo_ubicacion: info.sectores.tipo_ubicacion,
      cod_alfa_sector: info.sectores.cod_alfa_sector,
    });

    setSelectedValues(
      Array.isArray(info.informes.tipo_evento)
        ? info.informes[0].tipo_evento
        : []
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const arrayFormateado = `{${selectedValues.join(",")}}`;
    const datosActualizados = {
      ...informesALFA,
      tipo_evento: arrayFormateado, // Formato compatible con varchar[]
    };
    setSelectedValues(arrayFormateado);
    try {
      console.log("Datos informe:", informesALFA);

      // Configuración de la URL y método HTTP
      const url = params.id
        ? `${servidor_local}/alfa/${params.id}`
        : `${servidor_local}/alfa/`;
      const method = params.id ? "PUT" : "POST";

      // Realizar la solicitud al servidor
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      // Respuesta del servidor
      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      setEditing(true);
    } catch (error) {
      console.error("Error en handleSubmit:", error.message);
      alert("Hubo un problema al enviar el formulario. Inténtalo de nuevo.");
    }
  };

  const handleDeleteInforme = async () => {
    const id = params.id;

    await fetch(`${servidor_local}/alfa/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updateAlfa = { ...informesALFA };
    delete updateAlfa[id];
    setInformesALFA(updateAlfa);
    const res = await fetch(`${servidor_local}/lastalfa`);
    const data = await res.json();
    //console.log(data.informe_Alfa.cod_alfa);
    navigate(`/alfa/${data.informe_Alfa.cod_alfa}/edit`);
    // setDisabledNextButton(false);
  };

  const defaultInformes = {
    cod_alfa: "",
    fuente: "I. Municipalidad de San Antonio",
    fono: "352337133",
    sismo_escala: "",
    tipo_evento: "",
    otro_evento: "",
    descripcion: "",
    ocurrencia: "",
    acciones: "",
    oportunidad_tpo: "",
    recursos_involucrados: "",
    evaluacion_necesidades: "",
    capacidad_respuesta: "",
    observaciones: "",
    usuario_grd: "",
    fecha_hora: "",
    otras_necesidades: "",

    daños_vivienda: "",
    daños_infra: "",
    daños_personas: "",
    monto_estimado: "",
    cod_alfa_daños: "",

    region: "V Región",
    provincia: "San Antonio",
    comuna: "San Antonio",
    direccion: "",
    tipo_ubicacion: "",
    cod_alfa_sector: "",
  };

  const handleCheckbox = (event) => {
    const { value, checked } = event.target;

    setSelectedValues((prev) => {
      if (checked) {
        // Agregar al arreglo si está marcado
        return [...prev, value];
      } else {
        // Quitar del arreglo si se desmarca
        return prev.filter((item) => item !== value);
      }
    });

    // Importante: Ver el estado actualizado en tiempo real
    console.log("Valores seleccionados: ", selectedValues);
  };

  /* const handleDañosPersonasChange = (e, category, gender) => {
    const { value } = e.target;

    setInformesALFA((prevState) => ({
      ...prevState,
      daños_personas: {
        ...prevState.daños_personas,
        [category]: {
          ...prevState.daños_personas[category],
          [gender]: value,
        },
      },
    }));
  };*/

  const handleLastAlfa = async () => {
    const res = await fetch(`${servidor_local}/lastalfa`);
    if (res.ok) {
      const lastAlfa = await res.json();
      //console.log(lastAlfa);
      if (lastAlfa) {
        console.log(lastAlfa.informe_Alfa.cod_alfa);
        const id_alfa = lastAlfa.informe_Alfa.cod_alfa;
        navigate(`/alfa/${id_alfa}/edit`);
        setLastIdAlfa(id_alfa);
        setDisabledNextButton(true);
        setDisabledPrevButton(false);
      } else {
        console.log("No se encontró ningún expediente.");
      }
    } else {
      console.error("Error al obtener el último expediente.");
    }
  };

  const handleFirstAlfa = async () => {
    const res = await fetch(`${servidor_local}/firstalfa`);
    if (res.ok) {
      const firstAlfa = await res.json();
      //console.log(lastAlfa);
      if (firstAlfa) {
        console.log(firstAlfa.informe_Alfa.cod_alfa);
        const id_alfa = firstAlfa.informe_Alfa.cod_alfa;
        navigate(`/alfa/${id_alfa}/edit`);
        //setLastIdAlfa(id_alfa);
        console.log("Primer id", firstAlfa);
        setDisabledPrevButton(true);
        setDisabledNextButton(false);
      } else {
        console.log("No se encontró ningún expediente.");
      }
    } else {
      console.error("Error al obtener el último expediente.");
    }
  };

  const handlePrevious = async () => {
    try {
      const response = await fetch(`${servidor_local}/alfa/prev/${params.id}`);
      const data = await response.json();

      if (data?.informesRows?.length > 0 && data.informesRows[0].cod_alfa) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/alfa/${data.informesRows[0].cod_alfa}/edit`);
        setDisabledNextButton(false);
      } else {
        setDisabledPrevButton(true);
        console.log("No hay expediente anterior.");
      }
    } catch (error) {
      console.error("Error al obtener expediente anterior:", error);
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch(`${servidor_local}/alfa/next/${params.id}`);
      const data = await response.json();

      if (data?.informesRows?.length > 0 && data?.informesRows[0].cod_alfa) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/alfa/${data.informesRows[0].cod_alfa}/edit`);
        setDisabledPrevButton(false);
      } else {
        setDisabledNextButton(true);
        console.log("No hay expedientes.");
      }
    } catch (error) {
      console.error("Error al obtener expediente :", error);
    }
  };

  const handleNewAlfa = () => {
    navigate("/alfa/new");
    setEditing(false);
  };

  const handleChanges = async (e) => {
    const { name, value } = e.target;
    setInformesALFA({
      ...informesALFA,
      [name]: value,
    });

    console.log(name);
    console.log(value);
  };

  const handleEdit = async () => {
    setEditing(false);
  };

  const handleCancel = async () => {
    const id = params.id;

    try {
      const res = await fetch(`${servidor_local}/lastalfa`);

      if (!id) {
        if (res.ok) {
          const lastInforme = await res.json();
          if (lastInforme) {
            navigate(`/alfa/${lastInforme.informe_Alfa.cod_alfa}/edit`);
            console.log("ultima id", lastInforme.informe_Alfa.cod_alfa);
          }
        }
      }

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleFirstAlfa}
          //disabled={disabledPrevButton}
        >
          <i className="bi bi-skip-start me-1"></i> Primer Informe
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
          onClick={handleLastAlfa}
          //disabled={disabledNextButton}
        >
          Ultimo Informe <i className="bi bi-skip-end ms-1"></i>
        </button>
      </div>

      <div className="row">
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white d-flex justify-content-between">
              <div>
                <h4 className="card-title mb-0">Formulario Informes ALFA</h4>
                <strong>Código informe: </strong>
              </div>
            </div>
            <div className="card-body">
              <form className="was-validated" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <fieldset className="border rounded-3 p-3 mb-4">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Tipo de evento
                    </legend>
                    <div className="row g-4 justify-content-center">
                      <div className="col-md-auto">
                        <label htmlFor="ocurrencia" className="form-label">
                          Fecha de ocurrencia
                        </label>
                        <input
                          className="form-control"
                          type="datetime-local"
                          name="ocurrencia"
                          id="ocurrencia"
                          value={informesALFA.ocurrencia}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                      <div className="col-md-auto">
                        <label htmlFor="sismo_escala" className="form-label">
                          Sismo(Escala Mercali)
                        </label>
                        <select
                          className="form-control"
                          name="sismo_escala"
                          id="sismo_escala"
                          value={informesALFA.sismo_escala}
                          onChange={handleChanges}
                          disabled={editing}
                        >
                          <option value="">Seleccione magnitud</option>
                          <option value="I">I</option>
                          <option value="II">II</option>
                          <option value="III">III</option>
                          <option value="IV">IV</option>
                          <option value="V">V</option>
                          <option value="VI">VI</option>
                          <option value="VII">VII</option>
                          <option value="VIII">VIII</option>
                          <option value="IX">IX</option>
                          <option value="X">X</option>
                          <option value="XI">XI</option>
                          <option value="XII">XII</option>
                        </select>
                      </div>
                      <fieldset className="border rounded-3 p-3 mb-4">
                        <legend className="float-none w-auto px-2 h6 mb-0">
                          Eventos
                        </legend>
                        <div className="col-md-auto">
                          <div className="row row-cols-4">
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="inundacion">Inundación</label>
                                <input
                                  className="form-check-input"
                                  id="inundacion"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"inundacion"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "inundacion"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="temporal">Temporal</label>
                                <input
                                  className="form-check-input"
                                  id="temporal"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"temporal"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes("temporal")}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="activ_volcanica">
                                  Activ. Volcánica
                                </label>
                                <input
                                  className="form-check-input"
                                  id="activ_volcanica"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"activ_volcanica"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "activ_volcanica"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="incendio_forestal">
                                  Incendio Forestal
                                </label>
                                <input
                                  className="form-check-input"
                                  id="incendio_forestal"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"incendio_forestal"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "incendio_forestal"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="incendio_urbano">
                                  Incendio Urbano
                                </label>
                                <input
                                  className="form-check-input"
                                  id="incendio_urbano"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"incendio_urbano"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "incendio_urbano"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="sust_peligrosas">
                                  Sustancias Peligrosas
                                </label>
                                <input
                                  className="form-check-input"
                                  id="sust_peligrosas"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"sust_peligrosas"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "sust_peligrosas"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="acc_multiples_victim">
                                  Accidente Multiples Víctimas
                                </label>
                                <input
                                  className="form-check-input"
                                  id="acc_multiples_victim"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"acc_multiples"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "acc_multiples"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="corte_energia">
                                  Corte Energía Eléctrica
                                </label>
                                <input
                                  className="form-check-input"
                                  id="corte_energia"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"corte_energia"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "corte_energia"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="corte_agua">
                                  Corte de agua potable
                                </label>
                                <input
                                  className="form-check-input"
                                  id="corte_agua"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"corte_agua"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes(
                                    "corte_agua"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="otro">Otro</label>
                                <input
                                  className="form-check-input"
                                  id="otro"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"otro"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={selectedValues.includes("otro")}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>

                      <div className="col-md-6">
                        <label htmlFor="descripcion" className="form-label">
                          Descripción del evento
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="descripcion"
                          id="descripcion"
                          value={informesALFA.descripcion}
                          disabled={editing}
                          onChange={handleChanges}
                        ></textarea>
                      </div>
                      <div className="col-md-auto">
                        <label htmlFor="direccion" className="form-label">
                          Dirección / Ubicación
                        </label>
                        <input
                          className="form-control"
                          name="direccion"
                          id="direccion"
                          type="text"
                          value={informesALFA.direccion}
                          disabled={editing}
                          onChange={handleChanges}
                        />
                      </div>

                      <div className="col-md-auto">
                        <label htmlFor="" className="form-label">
                          Tipo de ubicación
                        </label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="tipo_ubicacion"
                            id="urbana"
                            value={"Urbana"}
                            checked={informesALFA.tipo_ubicacion === "Urbana"}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label htmlFor="urbana">Urbana</label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="tipo_ubicacion"
                            id="rural"
                            value={"Rural"}
                            checked={informesALFA.tipo_ubicacion === "Rural"}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label htmlFor="rural">Rural</label>
                        </div>

                        <div className="form-check">
                          <label htmlFor="ruralbana">Rural/Urbana</label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="tipo_ubicacion"
                            id="ruralbana"
                            value={"Rural/Urbana"}
                            checked={
                              informesALFA.tipo_ubicacion === "Rural/Urbana"
                            }
                            onChange={handleChanges}
                            disabled={editing}
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border rounded-3 p-3 mb-4">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Daños provocados
                    </legend>
                    <div className="row justify-content-center">
                      <div className="col">
                        <table className="table w-25">
                          <tr>
                            <th> </th>
                            <th>Hombres</th>
                            <th>Mujeres</th>
                          </tr>
                          <tr>
                            <td>Afectadas</td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.afectadas
                                    ?.hombres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      afectadas: {
                                        ...(prevState.daños_personas
                                          ?.afectadas || {}),
                                        hombres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.afectadas
                                    ?.mujeres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      afectadas: {
                                        ...(prevState.daños_personas
                                          ?.afectadas || {}),
                                        mujeres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Damnificadas</td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.damnificadas
                                    ?.hombres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      damnificadas: {
                                        ...(prevState.daños_personas
                                          ?.damnificadas || {}),
                                        hombres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.damnificadas
                                    ?.mujeres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      damnificadas: {
                                        ...(prevState.daños_personas
                                          ?.damnificadas || {}),
                                        mujeres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Heridas</td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.heridas
                                    ?.hombres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      heridas: {
                                        ...(prevState.daños_personas?.heridas ||
                                          {}),
                                        hombres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.heridas
                                    ?.mujeres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      heridas: {
                                        ...(prevState.daños_personas?.heridas ||
                                          {}),
                                        mujeres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className="col">
                        <table className="table w-25">
                          <tr>
                            <th> </th>
                            <th>Hombres</th>
                            <th>Mujeres</th>
                          </tr>
                          <tr>
                            <td>Muertes</td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.muertes
                                    ?.hombres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      muertes: {
                                        ...(prevState.daños_personas?.muertes ||
                                          {}),
                                        hombres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.muertes
                                    ?.mujeres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      muertes: {
                                        ...(prevState.daños_personas?.muertes ||
                                          {}),
                                        mujeres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Desaparecidas</td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.desaparecidas
                                    ?.hombres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      desaparecidas: {
                                        ...(prevState.daños_personas
                                          ?.desaparecidas || {}),
                                        hombres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.desaparecidas
                                    ?.mujeres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      desaparecidas: {
                                        ...(prevState.daños_personas
                                          ?.desaparecidas || {}),
                                        mujeres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Albergados</td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.albergados
                                    ?.hombres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      albergados: {
                                        ...(prevState.daños_personas
                                          ?.albergados || {}),
                                        hombres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={
                                  informesALFA.daños_personas?.albergados
                                    ?.mujeres || ""
                                }
                                onChange={(e) =>
                                  setInformesALFA((prevState) => ({
                                    ...prevState,
                                    daños_personas: {
                                      ...prevState.daños_personas,
                                      albergados: {
                                        ...(prevState.daños_personas
                                          ?.albergados || {}),
                                        mujeres: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                disabled={editing}
                              />
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className="col">
                        <h4>Daños a viviendas</h4>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="daños_vivienda"
                            id="daño_menor"
                            value={"Daño menor, habitable"}
                            checked={
                              informesALFA.daños_vivienda ===
                              "Daño menor, habitable"
                            }
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label
                            htmlFor="daño_menor"
                            className="form-check-label"
                          >
                            Daño menor, habitable
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="daños_vivienda"
                            id="daño_mayor"
                            value={"Daño mayor, no habitable"}
                            checked={
                              informesALFA.daños_vivienda ===
                              "Daño mayor, no habitable"
                            }
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label
                            htmlFor="daño_mayor"
                            className="form-check-label"
                          >
                            Daño mayor, no habitable
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="daños_vivienda"
                            id="destruida"
                            value={"Destruida, irrecuperable"}
                            checked={
                              informesALFA.daños_vivienda ===
                              "Destruida, irrecuperable"
                            }
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label
                            htmlFor="destruida"
                            className="form-check-label"
                          >
                            Destruida, irrecuperable
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="daños_vivienda"
                            id="no_evaluados"
                            checked={
                              informesALFA.daños_vivienda === "No evaluados"
                            }
                            value={"No evaluados"}
                            onChange={handleChanges}
                            disabled={editing}
                          />
                          <label
                            htmlFor="no_evaluados"
                            className="form-check-label"
                          >
                            No evaluados
                          </label>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="daños_infra" className="form-label">
                          Servicios básicos, infraestructura y otros
                        </label>
                        <br />
                        <textarea
                          className="form-control"
                          rows={3}
                          name="daños_infra"
                          id="daños_infra"
                          value={informesALFA.daños_infra}
                          onChange={handleChanges}
                          disabled={editing}
                        ></textarea>
                      </div>

                      <br />
                      <div className="col-md-4">
                        <label htmlFor="monto_estimado" className="form-label">
                          Monto estimado en daños
                        </label>
                        <input
                          className="form-control"
                          rows="3"
                          name="monto_estimado"
                          id="monto_estimado"
                          type="text"
                          value={informesALFA.monto_estimado}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="border rounded-3 p-3 mb-4">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Medidas tomadas
                    </legend>
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="acciones" className="form-label">
                          Acciones y soluciones inmediatas
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          name="acciones"
                          id="acciones"
                          value={informesALFA.acciones}
                          onChange={handleChanges}
                          disabled={editing}
                        ></textarea>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="oportunidad_tpo" className="form-label">
                          Oportunidad (TPO)
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          name="oportunidad_tpo"
                          id="oportunidad_tpo"
                          value={informesALFA.oportunidad_tpo}
                          onChange={handleChanges}
                          disabled={editing}
                        ></textarea>
                      </div>
                    </div>
                  </fieldset>

                  <h3>5. Recursos involucrados</h3>
                  <label htmlFor="">
                    Tipo humano, material,técnico,monetario
                  </label>
                  <textarea
                    name="recursos_involucrados"
                    id=""
                    value={informesALFA.recursos_involucrados}
                    onChange={handleChanges}
                    disabled={editing}
                  ></textarea>

                  <h3>6. Evaluación de necesidades</h3>
                  <input
                    type="radio"
                    name="evaluacion_necesidades"
                    id=""
                    value={"No se requiere"}
                    checked={
                      informesALFA.evaluacion_necesidades === "No se requiere"
                    }
                    onChange={handleChanges}
                    disabled={editing}
                  />
                  <label htmlFor="">
                    No se requiere (recursos insuficientes)
                  </label>
                  <input
                    type="radio"
                    name="evaluacion_necesidades"
                    id=""
                    value={"Se requiere"}
                    checked={
                      informesALFA.evaluacion_necesidades === "Se requiere"
                    }
                    onChange={handleChanges}
                    disabled={editing}
                  />
                  <label htmlFor="">
                    Se requiere (Indicar cantidad, tipo y motivo)
                  </label>
                  <textarea
                    name="otras_necesidades"
                    id=""
                    value={informesALFA.otras_necesidades}
                    onChange={handleChanges}
                    disabled={editing}
                  ></textarea>

                  <h3>7. Capacidad de respuesta</h3>
                  <select
                    name="capacidad_respuesta"
                    id=""
                    value={informesALFA.capacidad_respuesta}
                    onChange={handleChanges}
                    disabled={editing}
                  >
                    <option value="">Seleccione nivel</option>
                    <option value="1">Nivel I: Recurso local habitual</option>
                    <option value="2">Nivel II: Recurso local reforzado</option>
                    <option value="3">
                      Nivel III: Recurso Apoyo local regional
                    </option>
                    <option value="4">
                      Nivel IV: Recurso Apoyo nivel nacional
                    </option>
                  </select>

                  <h3>8. Observaciones</h3>
                  <textarea
                    name="observaciones"
                    id=""
                    value={informesALFA.observaciones}
                    onChange={handleChanges}
                    disabled={editing}
                  ></textarea>

                  <h3>9. Responsable del Informe</h3>
                  <select
                    name="usuario_grd"
                    id=""
                    value={informesALFA.usuario_grd}
                    onChange={handleChanges}
                    disabled={editing}
                  >
                    <option value="">Seleccione Responsable del informe</option>
                    {funcionarios.map((f) => (
                      <option key={f.id_funcionario} value={f.funcionario}>
                        {f.funcionario}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="">Fecha y hora</label>
                  <input
                    type="datetime-local"
                    name="fecha_hora"
                    id=""
                    value={informesALFA.fecha_hora}
                    onChange={handleChanges}
                    disabled={editing}
                  />
                </div>

                <br />
                <br />
                <button type="button" onClick={handleNewAlfa}>
                  Nuevo Expediente
                </button>
                <button
                  type="button"
                  onClick={handleEdit}
                  style={{ display: editing ? "" : "none" }}
                >
                  Editar
                </button>
                <button
                  type="submit"
                  style={{ display: editing ? "none" : "" }}
                >
                  Guardar Informe
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{ display: editing ? "none" : "" }}
                >
                  Cancelar
                </button>
                <button type="button" onClick={handleDeleteInforme}>
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div>
        <BlobProvider document={<AlfaPDF />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando documento</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Generar PDF
              </button>
            )
          }
        </BlobProvider>
      </div>
    </div>
  );
}

export default FormAlfa;
