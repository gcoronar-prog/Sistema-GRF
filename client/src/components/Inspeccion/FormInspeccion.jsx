import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import AttachFiles from "../AttachFiles";

import { BlobProvider } from "@react-pdf/renderer";
import InspeccionPDF from "../PDFs/InspeccionPDF";
import NavbarSGF from "../NavbarSGF";
import SearchExpediente from "./SearchExpediente";
import InspectPDF from "../PDFs/InspectPDF";

function FormInspeccion() {
  const navigate = useNavigate();
  const params = useParams();

  const [expedientes, setExpedientes] = useState({
    fecha_resolucion: "",
    user_creador: "",
    tipo_procedimiento: "",
    empadronado: "",
    inspector: "",
    testigo: "",

    id_inspector: "",

    id_leyes: "",
    id_glosas: "",

    id_infraccion: "",
    sector_infraccion: "",
    direccion_infraccion: "",
    fecha_citacion: "",
    juzgado: "",
    observaciones: "",
    fecha_infraccion: "",

    tipo_vehi: "",
    marca_vehi: "",
    ppu: "",
    color_vehi: "",
    id_vehiculos: "",

    rut_contri: "",
    giro_contri: "",
    nombre: "",
    direccion: "",
    rol_contri: "",

    num_control: "",
    estado_exp: "",
  });

  const [inspectores, setInspectores] = useState([]);

  const [ley, setLey] = useState([]);
  const [glosas, setGlosas] = useState([]);
  const [datosVehiculos, setDatosVehiculos] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [testigos, setTestigos] = useState([]);
  const [editing, setEditing] = useState(true);
  const [disabledPrevButton, setDisabledPrevButton] = useState(false);
  const [disabledNextButton, setDisabledNextButton] = useState(false);
  const [lastIdExp, setLastIdExp] = useState(null);

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const loadExpedientes = async (id) => {
    const res = await fetch(`${servidor_local}/exped/${id}`);
    const data = await res.json();
    const exped = data;
    const formattedDate = dayjs(exped.expediente.fecha_resolucion).format(
      "YYYY-MM-DDTHH:mm"
    );
    const formattedCitacion = dayjs(
      exped.detallesInfraccion.fecha_citacion
    ).format("YYYY-MM-DDTHH:mm");
    console.log(data.detallesInfraccion.fecha_citacion);

    setExpedientes({
      id_expediente: params.id,
      num_control: exped.expediente.num_control,
      estado_exp: exped.expediente.estado_exp,
      fecha_resolucion: formattedDate, //exped.expediente.fecha_resolucion,
      user_creador: exped.expediente.user_creador,
      tipo_procedimiento: exped.expediente.tipo_procedimiento,
      empadronado: exped.expediente.empadronado,
      inspector: exped.expediente.inspector,
      testigo: exped.expediente.testigo,

      id_inspector: exped.expediente.id_inspector,

      id_leyes: exped.expediente.id_leyes,
      id_glosas: exped.expediente.id_glosas,

      id_infraccion: exped.detallesInfraccion.id_infraccion,
      sector_infraccion: exped.detallesInfraccion.sector_infraccion,
      direccion_infraccion: exped.detallesInfraccion.direccion_infraccion,
      fecha_citacion: formattedCitacion, //exped.detallesInfraccion.fecha_citacion,
      juzgado: exped.detallesInfraccion.juzgado,
      observaciones: exped.detallesInfraccion.observaciones,
      fecha_infraccion: exped.detallesInfraccion.fecha_infraccion,

      tipo_vehi: exped.detallesVehiculo.tipo_vehi,
      marca_vehi: exped.detallesVehiculo.marca_vehi,
      ppu: exped.detallesVehiculo.ppu,
      color_vehi: exped.detallesVehiculo.color_vehi,
      id_vehiculos: exped.detallesVehiculo.id_vehiculos,

      rut_contri: exped.contribuyente.rut_contri,
      giro_contri: exped.contribuyente.giro_contri,
      nombre: exped.contribuyente.nombre,
      direccion: exped.contribuyente.direccion,
      rol_contri: exped.contribuyente.rol_contri,
    });
  };

  const loadInspectores = async () => {
    try {
      const res = await fetch(`${servidor_local}/inspectores`);
      if (!res.ok) throw new Error("Problemas obteniendo datos inspectores");
      const data = await res.json();
      setInspectores(data);
    } catch (error) {
      console.error("Error cargando inspectores:", error);
    }
  };

  const loadTestigo = async () => {
    try {
      const res = await fetch(`${servidor_local}/inspectores`);
      if (!res.ok) throw new Error("Problemas obteniendo datos testigos");

      const data = await res.json();
      setTestigos(data);
    } catch (error) {
      console.error("Error cargando testigos:", error);
    }
  };

  const loadLeyes = async () => {
    try {
      const res = await fetch(`${servidor_local}/leyes`);
      if (!res.ok) throw new Error("Problemas obteniendo leyes");
      const data = await res.json();
      setLey(data);
    } catch (error) {
      console.error("Error cargando leyes:", error);
    }
  };

  const loadGlosas = async () => {
    try {
      const res = await fetch(`${servidor_local}/glosas`);
      if (!res.ok) throw new Error("Problemas obteniendo datos de glosas");
      const data = await res.json();
      setGlosas(data);
    } catch (error) {
      console.error("Error cargando glosas:", error);
    }
  };

  const loadDatosVeh = async () => {
    try {
      const res = await fetch(`${servidor_local}/datos_vehi`);
      if (!res.ok) throw new Error("Problemas obteniendo datos de vehículos");
      const data = await res.json();
      setDatosVehiculos(data);
    } catch (error) {
      console.error("Error cargando datos de vehículos", error);
    }
  };

  const loadSectores = async () => {
    try {
      const res = await fetch(`${servidor_local}/sectores`);
      if (!res.ok) throw new Error("Problemas obteniendo sectores");
      const data = await res.json();
      setSectores(data);
    } catch (error) {
      console.error("Error cargando sectores", error);
    }
  };

  const loadIdExpedientes = async () => {
    try {
      const res = await fetch(`${servidor_local}/expedientes`);
      const data = await res.json();
      setIdExpedientes(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const defaultExpediente = {
    id_expediente: "",
    fecha_resolucion: "",
    user_creador: "",
    tipo_procedimiento: "",
    empadronado: "",
    inspector: "",
    testigo: "",

    id_inspector: "",

    id_leyes: "",
    id_glosas: "",

    id_infraccion: "",
    sector_infraccion: "",
    direccion_infraccion: "",
    fecha_citacion: "",
    juzgado: "",
    observaciones: "",
    fecha_infraccion: "",

    tipo_vehi: "",
    marca_vehi: "",
    ppu: "",
    color_vehi: "",
    id_vehiculos: "",

    rut_contri: "",
    giro_contri: "",
    nombre: "",
    direccion: "",
    rol_contri: "",
    num_control: "",
  };

  useEffect(() => {
    loadInspectores();

    loadLeyes();
    loadGlosas();
    loadDatosVeh();
    loadSectores();
    loadTestigo();
  }, []);

  useEffect(() => {
    if (params.id) {
      loadExpedientes(params.id);
    } else {
      setExpedientes(defaultExpediente);
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmar = window.confirm("¿Deseas guardar los cambios?");
    if (!confirmar) handleCancel(); // Si el usuario cancela, no sigue
    try {
      const url = params.id
        ? `${servidor_local}/exped/${params.id}`
        : `${servidor_local}/exped`;
      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expedientes),
      });
      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      if (!params.id) {
        const lastData = await fetch(`${servidor_local}/last/exped`);
        const lastExpediente = await lastData.json();

        if (lastExpediente && lastExpediente.expediente) {
          const lastIdInfo = lastExpediente.expediente.id_expediente;
          setLastIdExp(lastIdInfo); // Actualizar el estado (aunque es asíncrono)

          // Navegar a la nueva ruta
          navigate(`/inspect/${lastIdInfo}/edit`);
        }
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
    setEditing(true);
  };

  const handleDeleteExpediente = async () => {
    const eliminar = window.confirm("¿Deseas eliminar el informe?");
    if (!eliminar) return;

    const id = params.id;
    try {
      await fetch(`${servidor_local}/exped/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const updateExpedientes = { ...expedientes };
      delete updateExpedientes[id];
      setExpedientes(updateExpedientes);
      handleLastExpediente();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error al eliminar el expediente:", error);
      return;
    }
  };

  const handleNewExpediente = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDisabledNextButton(true);
    setDisabledPrevButton(true);
    setEditing(false);
    navigate("/inspect/new");
  };

  const handleChanges = async (e) => {
    const { name, type, value, checked } = e.target;
    setExpedientes({
      ...expedientes,
      [name]: type === "checkbox" ? checked : value,
    });

    console.log(name);
    console.log(value);
    //console.log(checked);
  };

  const handleLastExpediente = async () => {
    try {
      const response = await fetch(`${servidor_local}/last/exped`);

      if (response.ok) {
        const lastExpediente = await response.json();
        console.log(lastExpediente.expediente.id_expediente);
        if (lastExpediente) {
          console.log("Último expediente:", lastExpediente);
          navigate(`/inspect/${lastExpediente.expediente.id_expediente}/edit`);
          setDisabledNextButton(true);
          setDisabledPrevButton(false);
          setEditing(true);
          setLastIdExp(lastExpediente.expediente.id_expediente);
        } else {
          console.log("No se encontró ningún expediente.");
        }
      } else {
        console.error("Error al obtener el último expediente.");
      }
    } catch (error) {
      console.error("Error de red al obtener el último expediente:", error);
    }
  };

  const handleFirstExpediente = async () => {
    try {
      const response = await fetch(`${servidor_local}/first/exped`);

      if (response.ok) {
        const firstExpediente = await response.json();
        //console.log(firstExpediente.expediente.id_expediente);
        if (firstExpediente) {
          //console.log("Primer expediente:", firstExpediente);
          navigate(`/inspect/${firstExpediente.expediente.id_expediente}/edit`);
          setDisabledPrevButton(true);
          setDisabledNextButton(false);
        } else {
          console.log("No se encontró ningún expediente.");
        }
      } else {
        console.error("Error al obtener el primer expediente.");
      }
    } catch (error) {
      console.error("Error de red al obtener el primer expediente:", error);
    }
  };

  const handlePrevious = async () => {
    try {
      const response = await fetch(`${servidor_local}/exp/prev/${params.id}`);
      const data = await response.json();

      if (data?.expediente.id_expediente) {
        navigate(`/inspect/${data.expediente.id_expediente}/edit`);
        setDisabledNextButton(false);
      } else {
        console.log("No hay expediente anterior.");
      }
    } catch (error) {
      console.error("Error al obtener expediente anterior:", error);
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch(`${servidor_local}/exp/next/${params.id}`);
      const data = await response.json();

      if (data?.expediente.id_expediente) {
        navigate(`/inspect/${data.expediente.id_expediente}/edit`);
        setDisabledPrevButton(false);
      } else {
        console.log("No hay expediente.");
      }
    } catch (error) {
      console.error("Error al obtener expediente:", error);
    }
  };

  const handleEdit = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(false);
  };

  const handleCancel = async () => {
    /*const id = params.id;
    try {
      const response = await fetch(`${servidor_local}/last/exped`);

      if (!id) {
        if (response.ok) {
          const lastExpediente = await response.json();
          console.log(lastExpediente.expediente.id_expediente);
          if (lastExpediente) {
            console.log("Último expediente:", lastExpediente);
            navigate(
              `/inspect/${lastExpediente.expediente.id_expediente}/edit`
            );
            setDisabledNextButton(true);
            setDisabledPrevButton(false);
            setEditing(true);
            setLastIdExp(lastExpediente.expediente.id_expediente);
          } else {
            console.log("No se encontró ningún expediente.");
          }
        } else {
          console.error("Error al obtener el último expediente.");
        }
      }
    } catch (error) {
      console.error("Error de red al obtener el último expediente:", error);
    }
    setEditing(true);*/
    const id = params.id;

    try {
      if (!id) handleLastExpediente();
      loadExpedientes(id);

      setEditing(true);
    } catch (error) {
      console.error(error);
    }
    setEditing(true);
  };

  document.body.style = "background:rgb(236, 241, 241);";
  return (
    <>
      <NavbarSGF formulario={"inspeccion"} />
      <div className="container-fluid mt-4 w-100">
        <div className="d-flex flex-wrap align-items-center gap-2 my-3">
          <button
            className="btn btn-outline-primary d-flex align-items-center"
            type="button"
            onClick={handleFirstExpediente}
            disabled={disabledPrevButton || !editing}
          >
            <i className="bi bi-skip-start me-1"></i> Primer Expediente
          </button>
          <button
            className="btn btn-outline-primary d-flex align-items-center"
            type="button"
            onClick={handlePrevious}
            disabled={disabledPrevButton || !editing}
          >
            <i className="bi bi-chevron-left me-1"></i> Atras
          </button>
          <button
            className="btn btn-outline-primary d-flex align-items-center"
            type="button"
            onClick={handleNext}
            disabled={disabledNextButton || !editing}
          >
            Siguiente <i className="bi bi-chevron-right ms-1"></i>
          </button>
          <button
            className="btn btn-outline-primary d-flex align-items-center"
            type="button"
            onClick={handleLastExpediente}
            disabled={disabledNextButton || !editing}
          >
            Ultimo Expediente <i className="bi bi-skip-end ms-1"></i>
          </button>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header text-bg-success">
                <span className="form-label fw-bold">
                  N° Expediente: {expedientes.id_expediente}
                </span>
              </div>
              <div className="card-body">
                <form action="" onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label htmlFor="num_control" className="form-label">
                        Número de control
                      </label>
                      <input
                        name="num_control"
                        className="form-control"
                        type="text"
                        value={expedientes.num_control}
                        placeholder="Número de control"
                        onChange={handleChanges}
                        readOnly={editing}
                        required
                      />
                      <div className="">
                        <label htmlFor="" className="d-flex form-label">
                          Estado
                        </label>
                        <div className="row">
                          <div className="col">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="estado_exp"
                                id="pendiente"
                                value={"Pendiente"}
                                checked={expedientes.estado_exp === "Pendiente"}
                                onChange={handleChanges}
                                disabled={editing}
                                required
                              />
                              <label htmlFor="pendiente">Pendiente</label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="estado_exp"
                                id="resuelto"
                                value={"Resuelto"}
                                checked={expedientes.estado_exp === "Resuelto"}
                                onChange={handleChanges}
                                disabled={editing}
                                required
                              />
                              <label htmlFor="resuelto">Resuelto</label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="estado_exp"
                                id="despachado"
                                value={"Despachado"}
                                checked={
                                  expedientes.estado_exp === "Despachado"
                                }
                                onChange={handleChanges}
                                disabled={editing}
                                required
                              />
                              <label htmlFor="despachado">Despachado</label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="estado_exp"
                                id="nulo"
                                value={"Nulo"}
                                checked={expedientes.estado_exp === "Nulo"}
                                onChange={handleChanges}
                                disabled={editing}
                                required
                              />
                              <label htmlFor="nulo">Nulo</label>
                            </div>
                          </div>
                        </div>
                        <br />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="fecha_infraccion" className="form-label">
                        Fecha Infracción
                      </label>
                      <input
                        className="form-control"
                        type="datetime-local"
                        name="fecha_infraccion"
                        value={expedientes.fecha_infraccion}
                        onChange={handleChanges}
                        readOnly={editing}
                        required
                      />

                      <label htmlFor="fecha_resolucion" className="form-label">
                        Fecha Resolución
                      </label>
                      <input
                        className="form-control"
                        type="datetime-local"
                        name="fecha_resolucion"
                        id="fecha_resolucion"
                        value={expedientes.fecha_resolucion}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                    </div>

                    {/*user creador sera valor del token de inicio sesion hay que quitar este input al configurar todo */}
                    <input
                      hidden
                      name="user_creador"
                      type="text"
                      placeholder="Usuario digitador"
                      value={expedientes.user_creador}
                      onChange={handleChanges}
                      readOnly={editing}
                    />
                    <div className="col-md-6">
                      <label
                        htmlFor="tipo_procedimiento"
                        className="form-label"
                      >
                        Tipo de procedimiento
                      </label>
                      <select
                        className="form-select"
                        name="tipo_procedimiento"
                        id="tipo_procedimiento"
                        value={expedientes.tipo_procedimiento || ""}
                        onChange={handleChanges}
                        disabled={editing}
                        required
                      >
                        <option value="notificación">Notificación</option>
                        <option value="citación">Citación</option>
                        <option value="causas">Causas JPL</option>
                        <option value="solicitudes">
                          Solicitudes Generales
                        </option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="fecha_citacion"
                        className="fecha_citacion"
                      >
                        Fecha de citacion
                      </label>
                      <input
                        className="form-control"
                        type="datetime-local"
                        name="fecha_citacion"
                        id="fecha_citacion"
                        value={expedientes.fecha_citacion}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="juzgado" className="form-label">
                        Juzgado
                      </label>
                      <select
                        className="form-select"
                        name="juzgado"
                        id=""
                        value={expedientes.juzgado || ""}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Seleccione JPL</option>
                        <option value="JPL 1">JPL 1</option>
                        <option value="JPL 2">JPL 2</option>
                      </select>
                    </div>
                    <div className=" col-md-6 ">
                      <label
                        htmlFor="empadronado"
                        className="d-flex form-label"
                      >
                        ¿Empadronado?
                      </label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="empadronado"
                          id="si"
                          value={"Sí"}
                          checked={expedientes.empadronado === "Sí"}
                          onChange={handleChanges}
                          disabled={editing}
                          required
                        />
                        <label htmlFor="si">Sí</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="empadronado"
                          id="no"
                          value={"No"}
                          checked={expedientes.empadronado === "No"}
                          onChange={handleChanges}
                          disabled={editing}
                        />
                        <label htmlFor="no">No</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="inspector" className="form-label">
                        Inspector
                      </label>
                      <select
                        className="form-select"
                        name="id_inspector"
                        id="inspector"
                        value={expedientes.id_inspector || ""}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Seleccione Inspector</option>
                        {inspectores.map((i) => (
                          <option
                            key={i.id_funcionario}
                            value={i.id_funcionario}
                          >
                            {i.funcionario}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="testigo" className="form-label">
                        Testigo
                      </label>
                      <select
                        className="form-select"
                        name="testigo"
                        id="testigo"
                        value={expedientes.testigo || ""}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Seleccione Testigo</option>
                        {testigos.map((insp) => (
                          <option
                            key={insp.id_funcionario}
                            value={insp.funcionario}
                          >
                            {insp.funcionario}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="rut_contri" className="form-label">
                        Rut Contribuyente
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="rut_contri"
                        placeholder="Rut Contribuyente"
                        value={expedientes.rut_contri}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                      <label htmlFor="giro_contri" className="form-label">
                        Giro Contribuyente
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="giro_contri"
                        placeholder="Giro del Contribuyente"
                        value={expedientes.giro_contri}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="nombre" className="form-label">
                        Nombre contribuyente
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="nombre"
                        placeholder="Nombre del Contribuyente"
                        value={expedientes.nombre}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                      <label htmlFor="direccion" className="form-label">
                        Dirección contribuyente
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="direccion"
                        placeholder="Dirección del Contribuyente"
                        value={expedientes.direccion}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="rol_contri" className="form-label">
                        Rol Contribuyente
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="rol_contri"
                        placeholder="Rol del Contribuyente"
                        value={expedientes.rol_contri}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                    </div>
                    <div className="col-md-6">
                      {/*Nací para rellenar la columna :P*/}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="direccion_infraccion"
                        className="form-label"
                      >
                        Dirección Infracción
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="direccion_infraccion"
                        placeholder="Direccion infraccion"
                        value={expedientes.direccion_infraccion}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="sector_infraccion" className="form-label">
                        Sector de infracción
                      </label>
                      <select
                        className="form-select"
                        name="sector_infraccion"
                        id=""
                        value={expedientes.sector_infraccion || ""}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">
                          Seleccione sector de la infraccion
                        </option>
                        {sectores.map((s) => (
                          <option key={s.id_sector} value={s.sector}>
                            {s.sector}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="id_leyes">Ley aplicada</label>
                      <select
                        className="form-select"
                        name="id_leyes"
                        id=""
                        value={expedientes.id_leyes || ""}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Seleccione ley</option>
                        {ley.map((l) => (
                          <option key={l.id_ley} value={l.id_ley}>
                            {l.ley}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="id_glosas">Glosa</label>
                      <select
                        className="form-select"
                        name="id_glosas"
                        id=""
                        value={expedientes.id_glosas || ""}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Seleccione glosa de ley</option>
                        {glosas.map((g) => (
                          <option key={g.id_glosa} value={g.id_glosa}>
                            {g.glosa_ley}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="tipo_vehi" className="form-label">
                        Tipo de Vehiculo
                      </label>
                      <select
                        className="form-select"
                        name="tipo_vehi"
                        id=""
                        value={expedientes.tipo_vehi}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Tipo de Vehiculo</option>
                        {datosVehiculos.map((tipo) => (
                          <option key={tipo.id_veh} value={tipo.tipo}>
                            {tipo.tipo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="marca_vehi" className="form-label">
                        Marca de Vehiculo
                      </label>
                      <select
                        className="form-select"
                        name="marca_vehi"
                        id=""
                        value={expedientes.marca_vehi}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Marca del Vehiculo</option>
                        {datosVehiculos.map((tipo) => (
                          <option key={tipo.marca} value={tipo.marca}>
                            {tipo.marca}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="color_vehi" className="form-label">
                        Color de Vehiculo
                      </label>
                      <select
                        className="form-select"
                        name="color_vehi"
                        id=""
                        value={expedientes.color_vehi}
                        onChange={handleChanges}
                        disabled={editing}
                      >
                        <option value="">Color del Vehiculo</option>
                        {datosVehiculos.map((tipo) => (
                          <option key={tipo.color} value={tipo.color}>
                            {tipo.color}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="ppu" className="form-label">
                        P.P.U de Vehiculo
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="ppu"
                        placeholder="PPU"
                        value={expedientes.ppu}
                        onChange={handleChanges}
                        readOnly={editing}
                      />
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="observaciones" className="form-label">
                        Observaciones
                      </label>
                      <textarea
                        className="form-control"
                        name="observaciones"
                        id="observaciones"
                        rows={4}
                        placeholder="Escriba aquí..."
                        value={expedientes.observaciones}
                        onChange={handleChanges}
                        readOnly={editing}
                      ></textarea>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={handleNewExpediente}
                        style={{ display: editing ? "" : "none" }}
                      >
                        <i className="bi bi-clipboard2-plus"></i> Nuevo
                        Expediente
                      </button>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        style={{ display: editing ? "none" : "" }}
                      >
                        <i className="bi bi-floppy2"></i> Guardar Expediente
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleEdit}
                        style={{ display: editing ? "" : "none" }}
                      >
                        <i className="bi bi-pencil-square"></i> Editar
                      </button>

                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={handleCancel}
                        style={{ display: editing ? "none" : "" }}
                      >
                        <i className="bi bi-x-octagon"></i> Cancelar
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={handleDeleteExpediente}
                        style={{ display: editing ? "" : "none" }}
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => InspectPDF(params.id)}
                >
                  <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <SearchExpediente />
          </div>
        </div>
        <br />
        <div className="row">
          {editing ? <AttachFiles idInforme={params.id} /> : ""}
        </div>
      </div>
    </>
  );
}

export default FormInspeccion;
