import dayjs from "dayjs";
import "../GRD/alfaForm.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTokenSession } from "../useTokenSession";
import AlfaPDF from "../PDFs/AlfaPDF.jsx";
import { useReactToPrint } from "react-to-print";

const FormAlfa = () => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Informe ALFA",
  });

  const params = useParams();
  const navigate = useNavigate();
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");
  const user = useTokenSession();
  const tipoEventoRef = useRef();
  const fechaOcurRef = useRef();
  const descRef = useRef();
  const direccionRef = useRef();
  const ubicacionRef = useRef();

  const ev_danioRef = useRef();

  const [informesALFA, setInformesALFA] = useState({
    //danios_cte
    tipo_afectados: {
      afectadas: { hombres: 0, mujeres: 0 },
      damnificadas: { hombres: 0, mujeres: 0 },
      heridas: { hombres: 0, mujeres: 0 },
      muertes: { hombres: 0, mujeres: 0 },
      desaparecidas: { hombres: 0, mujeres: 0 },
      albergados: { hombres: 0, mujeres: 0 },
    },
    danio_vivienda: "",
    ev_danio: "",
    danios_servicio: "",
    monto_danio: "",
    //eval_cte
    acciones: "",
    oportunidad: "",
    recursos: "",
    necesidades: "",
    desc_necesidades: "",
    cap_respuesta: "",
    observaciones: "",
    //event_cte
    fuente_info: "",
    telefono: "35-2337133",
    tipo_evento: "",
    escala_sismo: "",
    otro_evento: "",
    direccion: "",
    tipo_ubicacion: "",
    desc_evento: "",
    fecha_ocurrencia: "",
    //resp_cte
    funcionario: "",
    fecha_documento: "",
    //sector_cte
    region: "V Región",
    provincia: "San Antonio",
    comuna: "San Antonio",
  });

  const decoded = jwtDecode(token);
  const user_decoded = decoded;
  const nombre_responsable = [user_decoded.nombre, user_decoded.apellido]
    .filter(Boolean)
    .join(" ");

  const [editing, setEditing] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [lastIdAlfa, setLastIdAlfa] = useState(null);
  const [hiddenRequerido, setHiddenRequerido] = useState(true);
  const [disabledPrevButton, setDisabledPrevButton] = useState(false);
  const [disabledNextButton, setDisabledNextButton] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadInformes(params.id);
    } else {
      setInformesALFA(defaultInformes);
      setSelectedValues("");
    }
  }, [params.id]);

  const loadInformes = async (id) => {
    console.log(decoded);
    const res = await fetch(`${servidor_local}/alfa/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log("alfa", data.informe_alfa[0]);
    if (!res.ok) throw new Error("Problemas obteniendo datos de informes");
    const data = await res.json();

    const info = data;
    const formattedOcurrencia = dayjs(
      info.informe_alfa[0].fecha_ocurrencia,
    ).format("YYYY-MM-DDTHH:mm");

    const date = new Date();
    const formattedDate = dayjs(info.informe_alfa[0].fecha_documento).format(
      "DD-MM-YYYY",
    );
    const horaDocu = dayjs(info.informe_alfa[0].fecha_documento).format(
      "HH:mm",
    );
    /*  const formattedDate = info.informe_alfa[0].fecha_documento
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
    const horaDocu = date.toISOString().slice(11, 16);*/

    //console.log(data.informes[0].cod_alfa);

    setInformesALFA({
      //danios_cte
      cod_alfa: info.informe_alfa[0].cod_alfa,
      tipo_afectados: info.informe_alfa[0].tipo_afectados,
      danio_vivienda: info.informe_alfa[0].danio_vivienda,
      ev_danio: info.informe_alfa[0].ev_danio,
      danios_servicio: info.informe_alfa[0].danios_servicio,
      monto_danio: info.informe_alfa[0].monto_danio,
      //eval_cte
      acciones: info.informe_alfa[0].acciones,
      oportunidad: info.informe_alfa[0].oportunidad,
      recursos: info.informe_alfa[0].recursos,
      necesidades: info.informe_alfa[0].necesidades,
      desc_necesidades: info.informe_alfa[0].desc_necesidades,
      cap_respuesta: info.informe_alfa[0].cap_respuesta,
      observaciones: info.informe_alfa[0].observaciones,
      //event_cte
      fuente_info: "I Municipalidad de San Antonio",
      telefono: "35-2337133",
      tipo_evento: info.informe_alfa[0].tipo_evento,
      escala_sismo: info.informe_alfa[0].escala_sismo,
      otro_evento: info.informe_alfa[0].otro_evento,
      direccion: info.informe_alfa[0].direccion,
      tipo_ubicacion: info.informe_alfa[0].tipo_ubicacion,
      desc_evento: info.informe_alfa[0].desc_evento,
      fecha_ocurrencia: formattedOcurrencia,
      //resp_cte
      funcionario: nombre_responsable,
      fecha_documento: formattedDate + " / " + horaDocu,
      //sector_cte
      region: "V Región",
      provincia: "San Antonio",
      comuna: "San Antonio",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmpty = (value) => {
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === "string") return value.trim() === "";
      return value === null || value === undefined;
    };

    const requeridos = [
      {
        field: informesALFA.tipo_evento,
        ref: tipoEventoRef,
      },
      { field: informesALFA.fecha_ocurrencia, ref: fechaOcurRef },
      { field: informesALFA.desc_evento, ref: descRef },
      { field: informesALFA.direccion, ref: direccionRef },
      { field: informesALFA.tipo_ubicacion, ref: ubicacionRef },

      { field: informesALFA.necesidades, ref: ev_danioRef },
    ];

    const errorRequerido = requeridos.find((f) => isEmpty(f.field));

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

    const datosActualizados = {
      ...informesALFA,
      //tipo_evento: selectedValues,
    };

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
    handleLastAlfa();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteInforme = async () => {
    const eliminar = window.confirm("¿Deseas eliminar el informe?");
    if (!eliminar) return;

    const id = params.id;

    try {
      await fetch(`${servidor_local}/alfa/${id}`, {
        method: "DELETE",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      const updateAlfa = { ...informesALFA };
      delete updateAlfa[id];
      setInformesALFA(updateAlfa);
      handleLastAlfa();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
    }
  };

  const defaultInformes = {
    //danios_cte
    tipo_afectados: {
      afectadas: { hombres: 0, mujeres: 0 },
      damnificadas: { hombres: 0, mujeres: 0 },
      heridas: { hombres: 0, mujeres: 0 },
      muertes: { hombres: 0, mujeres: 0 },
      desaparecidas: { hombres: 0, mujeres: 0 },
      albergados: { hombres: 0, mujeres: 0 },
    },
    danio_vivienda: "",
    ev_danio: "",
    danios_servicio: "",
    monto_danio: "",
    //eval_cte
    acciones: "",
    oportunidad: "",
    recursos: "",
    necesidades: "",
    desc_necesidades: "",
    cap_respuesta: "",
    observaciones: "",
    //event_cte
    fuente_info: "",
    telefono: "35-2337133",
    tipo_evento: "",
    escala_sismo: "",
    otro_evento: "",
    direccion: "",
    tipo_ubicacion: "",
    desc_evento: "",
    fecha_ocurrencia: "",
    //resp_cte
    funcionario: "",
    fecha_documento: "",
    //sector_cte
    region: "V Región",
    provincia: "San Antonio",
    comuna: "San Antonio",
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    setInformesALFA((prev) => {
      const nuevosEventos = checked
        ? [...prev.tipo_evento, value]
        : prev.tipo_evento.filter((v) => v !== value);

      return {
        ...prev,
        tipo_evento: nuevosEventos,
        otro_evento: value === "otro" && !checked ? "" : prev.otro_evento,
      };
    });
  };

  const handleLastAlfa = async () => {
    const res = await fetch(`${servidor_local}/lastalfa`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const lastAlfa = await res.json();
      //console.log("lastalfa ",lastAlfa[0]);
      if (lastAlfa[0]) {
        //console.log("idlast ",lastAlfa[0].id_alfa);
        const id_alfa = lastAlfa[0].id_alfa;

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
    setHasError(false);
  };

  const handleFirstAlfa = async () => {
    const res = await fetch(`${servidor_local}/firstalfa`);
    if (res.ok) {
      const firstAlfa = await res.json();
      //console.log(lastAlfa);
      if (firstAlfa) {
        console.log(firstAlfa[0].id_alfa);
        const id_alfa = firstAlfa[0].id_alfa;
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
    setHasError(false);
  };

  const handlePrevious = async () => {
    try {
      const response = await fetch(`${servidor_local}/alfa/prev/${params.id}`);
      const data = await response.json();

      if (data?.length > 0 && data[0]?.id_alfa) {
        navigate(`/alfa/${data[0].id_alfa}/edit`);
        setDisabledNextButton(false);
      } else {
        setDisabledPrevButton(true);
        console.log("No hay expediente anterior.");
      }
    } catch (error) {
      console.error("Error al obtener expediente anterior:", error);
    }
    setHasError(false);
  };

  const handleNext = async () => {
    try {
      const response = await fetch(`${servidor_local}/alfa/next/${params.id}`);
      const data = await response.json();

      if (data?.length > 0 && data[0]?.id_alfa) {
        //console.log(data.informesRows[0].cod_alfa);
        navigate(`/alfa/${data[0].id_alfa}/edit`);
        setDisabledPrevButton(false);
      } else {
        setDisabledNextButton(true);
        console.log("No hay expedientes.");
      }
    } catch (error) {
      console.error("Error al obtener expediente :", error);
    }
    setHasError(false);
  };

  const handleNewAlfa = () => {
    navigate("/alfa/new");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(false);
  };

  const handleChanges = async (e) => {
    const { name, value } = e.target;
    setInformesALFA({
      ...informesALFA,
      [name]: value,
    });

    if (value === "Se requiere") {
      setInformesALFA((prev) => ({
        ...prev,
        desc_necesidades: "",
      }));
    }
  };

  const handleEdit = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(false);
  };

  const handleCancel = async () => {
    const id = params.id;
    try {
      if (!id) handleLastAlfa();
      loadInformes(id);

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(true);
    setHasError(false);
  };

  const gruposAfectados = [
    ["afectadas", "damnificadas", "heridas"],
    ["muertes", "desaparecidas", "albergados"],
  ];
  const updateAfectados = (grupo, sexo, valor) => {
    setInformesALFA((prev) => ({
      ...prev,
      tipo_afectados: {
        ...prev.tipo_afectados,
        [grupo]: {
          ...prev.tipo_afectados[grupo],
          [sexo]: Number(valor),
        },
      },
    }));
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleFirstAlfa}
          disabled={!editing}
        >
          <i className="bi bi-skip-start me-1"></i> Primer Informe
        </button>
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handlePrevious}
          disabled={!editing}
        >
          <i className="bi bi-chevron-left me-1"></i> Anterior
        </button>
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleNext}
          disabled={!editing}
        >
          Siguiente <i className="bi bi-chevron-right ms-1"></i>
        </button>
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleLastAlfa}
          disabled={!editing}
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
                <strong>Código informe: {informesALFA.cod_alfa}</strong>
              </div>
            </div>
            <div className="card-body">
              <form className="" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <fieldset className="border border-primary rounded p-3">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Tipo de evento
                    </legend>
                    <div className="row g-4">
                      <div className="col-md-auto" ref={fechaOcurRef}>
                        <label htmlFor="ocurrencia" className="form-label">
                          Fecha de ocurrencia
                        </label>
                        <div className={hasError ? "rounded error-focus" : ""}>
                          <input
                            className="form-control"
                            type="datetime-local"
                            name="fecha_ocurrencia"
                            id="ocurrencia"
                            value={informesALFA.fecha_ocurrencia}
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
                        <label htmlFor="sismo_escala" className="form-label">
                          Sismo(Escala Mercali)
                        </label>
                        <select
                          className="form-control"
                          name="escala_sismo"
                          id="sismo_escala"
                          value={informesALFA.escala_sismo}
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
                      <fieldset className="border rounded-3 p-3 mb-0">
                        <legend className="float-none w-auto px-2 h6 mb-0">
                          Eventos
                        </legend>

                        <div
                          ref={tipoEventoRef}
                          className={"col-md-auto pb-0 px-2"}
                        >
                          <div className="row row-cols-3">
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="inundacion">Inundación</label>
                                <input
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="inundacion"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"INUNDACIÓN"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "INUNDACIÓN",
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="temporal">Temporal</label>
                                <input
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="temporal"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"TEMPORAL"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "TEMPORAL",
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="deslizamiento">
                                  Activ. Volcánica
                                </label>
                                <input
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="deslizamiento"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"DESLIZAMIENTO"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "DESLIZAMIENTO",
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="activ_volcanica">
                                  Activ. Volcánica
                                </label>
                                <input
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="activ_volcanica"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"ACT. VOLCÁNICA"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "ACT. VOLCÁNICA",
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
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="incendio_forestal"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"INC. FORESTAL"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "INC. FORESTAL",
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
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="incendio_urbano"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"INCENDIO URBANO"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "INCENDIO URBANO",
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
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="sust_peligrosas"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"SUST. PELIGROSAS"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "SUST. PELIGROSAS",
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
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="acc_multiples_victim"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"ACC. MULT. VÍCTIMAS"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "ACC. MULT. VÍCTIMAS",
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
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="corte_energia"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"CORTE ENERGÍA"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "CORTE ENERGÍA",
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
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="corte_agua"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"CORTE AGUA"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "CORTE AGUA",
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-check-inline">
                                <label htmlFor="otro">Otro</label>
                                <input
                                  className={`form-check-input ${hasError ? "error-focus" : ""}`}
                                  id="otro"
                                  name="tipo_evento"
                                  type="checkbox"
                                  value={"OTRO"}
                                  onChange={handleCheckbox}
                                  disabled={editing}
                                  checked={informesALFA.tipo_evento.includes(
                                    "OTRO",
                                  )}
                                />
                              </div>
                            </div>
                            {informesALFA.tipo_evento.includes("OTRO") && (
                              <div className="col">
                                <input
                                  className="form-control"
                                  type="text"
                                  id="otro_evento"
                                  name="otro_evento"
                                  placeholder="indique evento"
                                  disabled={editing}
                                  value={informesALFA.otro_evento}
                                  onChange={handleChanges}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        {hasError && (
                          <div className="text-danger small">
                            *Campos obligatorios
                          </div>
                        )}
                      </fieldset>
                      <div className="col-md-6 pt-0" ref={descRef}>
                        <label htmlFor="desc_evento" className="form-label">
                          Descripción del evento
                        </label>
                        <textarea
                          className={`form-control ${hasError ? "error-focus" : ""}`}
                          rows="2"
                          name="desc_evento"
                          id="desc_evento"
                          value={informesALFA.desc_evento}
                          disabled={editing}
                          onChange={handleChanges}
                        ></textarea>
                        {hasError && (
                          <div className="text-danger small">
                            *Campo obligatorio
                          </div>
                        )}
                      </div>
                      <div className="col" ref={direccionRef}>
                        <label htmlFor="direccion" className="form-label">
                          Dirección / Ubicación
                        </label>
                        <input
                          className={`form-control ${hasError ? "error-focus" : ""}`}
                          name="direccion"
                          id="direccion"
                          type="text"
                          value={informesALFA.direccion}
                          disabled={editing}
                          onChange={handleChanges}
                        />
                        {hasError && (
                          <div className="text-danger small">
                            *Campo obligatorio
                          </div>
                        )}
                      </div>

                      <div className="col" ref={ubicacionRef}>
                        <label htmlFor="" className="form-label">
                          Tipo de ubicación
                        </label>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${hasError ? "error-focus" : ""}`}
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
                            className={`form-check-input ${hasError ? "error-focus" : ""}`}
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
                            className={`form-check-input ${hasError ? "error-focus" : ""}`}
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
                        {hasError && (
                          <div className="text-danger small">
                            *Campo obligatorio
                          </div>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border border-primary rounded p-3">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Daños identificados
                    </legend>
                    <div className="row">
                      {gruposAfectados.map((bloque, i) => (
                        <div key={i} className="col-md-3">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Hombres</th>
                                <th>Mujeres</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bloque.map((grupo) => (
                                <tr key={grupo}>
                                  <td className="text-start fw-semibold text-capitalize">
                                    {grupo}
                                  </td>
                                  {["hombres", "mujeres"].map((sexo) => (
                                    <td key={sexo}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm text-center"
                                        value={
                                          informesALFA.tipo_afectados?.[
                                            grupo
                                          ]?.[sexo] ?? ""
                                        }
                                        disabled={editing}
                                        onChange={(e) =>
                                          updateAfectados(
                                            grupo,
                                            sexo,
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                      <div className="col" style={{ marginLeft: "90px" }}>
                        <label htmlFor="" className="form-label">
                          Daño vivienda
                        </label>
                        {[
                          "Daño menor habitable",
                          "Daño mayor no habitable",
                          "Destuidas, irrecuperables",
                          "No evaluadas",
                        ].map((danio) => {
                          const idDanio = danio
                            .toLowerCase()
                            .replace(/\s+/g, "-");
                          return (
                            <div className="form-check" key={danio.length}>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="ev_danio"
                                id={idDanio}
                                value={danio}
                                checked={informesALFA.ev_danio === danio}
                                onChange={handleChanges}
                                disabled={editing}
                              />
                              <label
                                htmlFor={idDanio}
                                className="form-check-label"
                              >
                                {danio}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <hr />
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="danio_vivienda" className="form-label">
                          Servicios básicos, infraestructura y otros
                        </label>
                        <br />
                        <textarea
                          className="form-control"
                          rows={2}
                          name="danio_vivienda"
                          id="danio_vivienda"
                          value={informesALFA.danio_vivienda}
                          onChange={handleChanges}
                          disabled={editing}
                        ></textarea>
                      </div>

                      <br />
                      <div className="col-md-4">
                        <label htmlFor="monto_danio" className="form-label">
                          Monto estimado en daños
                        </label>
                        <input
                          className="form-control"
                          name="monto_danio"
                          id="monto_danio"
                          type="text"
                          value={informesALFA.monto_danio}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border border-primary rounded p-3">
                    <legend className="float-none w-auto px-2 h6 mb-0">
                      Respuesta institucional
                    </legend>
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
                            rows={2}
                            name="acciones"
                            id="acciones"
                            value={informesALFA.acciones}
                            onChange={handleChanges}
                            disabled={editing}
                          ></textarea>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="oportunidad" className="form-label">
                            Oportunidad (TPO)
                          </label>
                          <textarea
                            className="form-control"
                            rows={2}
                            name="oportunidad"
                            id="oportunidad"
                            value={informesALFA.oportunidad}
                            onChange={handleChanges}
                            disabled={editing}
                          ></textarea>
                        </div>
                      </div>
                    </fieldset>

                    <fieldset className="border rounded-3 p-3 mb-4">
                      <legend className="float-none w-auto px-2 h6 mb-0">
                        Recursos involucrados
                      </legend>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="recursos">
                          Tipo humano, material,técnico,monetario
                        </label>
                        <textarea
                          className="form-control"
                          name="recursos"
                          rows={2}
                          id="recursos"
                          value={informesALFA.recursos}
                          onChange={handleChanges}
                          disabled={editing}
                        ></textarea>
                      </div>
                    </fieldset>
                    <fieldset className="border rounded-3 p-3 mb-4">
                      <legend className="float-none w-auto px-2 h6 mb-0">
                        Evaluación de necesidades
                      </legend>
                      <div className="row">
                        <div className="col" ref={ev_danioRef}>
                          <div className="form-check">
                            <input
                              className={`form-check-input ${hasError ? "error-focus" : ""}`}
                              type="radio"
                              name="necesidades"
                              id="no_requerida"
                              value={"No se requiere"}
                              checked={
                                informesALFA.necesidades === "No se requiere"
                              }
                              onChange={handleChanges}
                              disabled={editing}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="no_requerida"
                            >
                              No se requiere (recursos insuficientes)
                            </label>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-check">
                            <input
                              className={`form-check-input ${hasError ? "error-focus" : ""}`}
                              type="radio"
                              name="necesidades"
                              id="requerida"
                              value={"Se requiere"}
                              checked={
                                informesALFA.necesidades === "Se requiere"
                              }
                              onChange={handleChanges}
                              disabled={editing}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="requerida"
                            >
                              Se requiere
                            </label>
                          </div>
                        </div>
                        {informesALFA.necesidades === "Se requiere" && (
                          <div className="col-md-6">
                            <textarea
                              className="form-control"
                              name="desc_necesidades"
                              placeholder="Indicar cantidad, tipo y motivo"
                              id=""
                              value={informesALFA.desc_necesidades}
                              onChange={handleChanges}
                              disabled={editing}
                            ></textarea>
                          </div>
                        )}
                        {hasError && (
                          <div className="text-danger small">
                            *Campo obligatorio
                          </div>
                        )}
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="" className="form-label fw-bold">
                            Niveles de Emergencia
                          </label>
                          <select
                            className="form-select"
                            name="cap_respuesta"
                            id=""
                            value={informesALFA.cap_respuesta}
                            onChange={handleChanges}
                            disabled={editing}
                          >
                            <option value="">Seleccione nivel</option>
                            <option value="0">Emergencia Menor</option>
                            <option value="1">Emergencia Mayor</option>
                            <option value="2">Desastre</option>
                            <option value="3">Catástrofe</option>
                          </select>
                        </div>
                      </div>
                    </fieldset>

                    <fieldset className="border rounded-3 p-3 mb-4">
                      <legend className="float-none w-auto px-2 h6 mb-0">
                        Observaciones
                      </legend>
                      <div className="row">
                        <div className="col-md-6">
                          <textarea
                            className="form-control"
                            rows={4}
                            name="observaciones"
                            id=""
                            value={informesALFA.observaciones}
                            onChange={handleChanges}
                            disabled={editing}
                          ></textarea>
                        </div>
                        <div className="col-md-6">
                          <div className="row text-center">
                            <div className="col">
                              <span className=" fst-italic fw-bold">
                                Fecha y hora documento:
                              </span>
                              <br />
                              <span> {informesALFA.fecha_documento}</span>
                            </div>
                            <div className="col text center ">
                              <span className="fst-italic fw-bold ">
                                Responsable del informe:
                              </span>
                              <span> {nombre_responsable}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
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
                    onClick={handleNewAlfa}
                  >
                    <i className="bi bi-clipboard2-plus"></i> Nuevo informe
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
                    onClick={handleDeleteInforme}
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
              <AlfaPDF ref={printRef} data={informesALFA} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAlfa;
