import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import AttachFiles from "../AttachFiles";

import { BlobProvider } from "@react-pdf/renderer";
import InspeccionPDF from "../PDFs/InspeccionPDF";

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
    patr_mixto: "",
    patrullero: "",
    id_inspector: "",
    id_patrullero: "",
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
  });

  const [inspectores, setInspectores] = useState([]);
  const [patrulleros, setPatrulleros] = useState([]);
  const [ley, setLey] = useState([]);
  const [glosas, setGlosas] = useState([]);
  const [datosVehiculos, setDatosVehiculos] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [testigos, setTestigos] = useState([]);
  const [editing, setEditing] = useState(true);
  const [disabledPrevButton, setDisabledPrevButton] = useState(false);
  const [disabledNextButton, setDisabledNextButton] = useState(false);
  const [lastIdExp, setLastIdExp] = useState(null);

  const loadExpedientes = async (id) => {
    const res = await fetch(`http://localhost:3000/exped/${id}`);
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
      fecha_resolucion: formattedDate, //exped.expediente.fecha_resolucion,
      user_creador: exped.expediente.user_creador,
      tipo_procedimiento: exped.expediente.tipo_procedimiento,
      empadronado: exped.expediente.empadronado,
      inspector: exped.expediente.inspector,
      testigo: exped.expediente.testigo,
      patr_mixto: exped.expediente.patr_mixto,
      patrullero: exped.expediente.patrullero,
      id_inspector: exped.expediente.id_inspector,
      id_patrullero: exped.expediente.id_patrullero,
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
      const res = await fetch("http://localhost:3000/inspectores");
      if (!res.ok) throw new Error("Problemas obteniendo datos inspectores");
      const data = await res.json();
      setInspectores(data);
    } catch (error) {
      console.error("Error cargando inspectores:", error);
    }
  };

  const loadTestigo = async () => {
    try {
      const res = await fetch("http://localhost:3000/inspectores");
      if (!res.ok) throw new Error("Problemas obteniendo datos testigos");

      const data = await res.json();
      setTestigos(data);
    } catch (error) {
      console.error("Error cargando testigos:", error);
    }
  };

  const loadPatrulleros = async () => {
    try {
      const res = await fetch("http://localhost:3000/patrulleros");
      if (!res.ok) throw new Error("Problemas obteniendo patrulleros");
      const data = await res.json();
      setPatrulleros(data);
    } catch (error) {
      console.error("Error cargando patrulleros:", error);
    }
  };

  const loadLeyes = async () => {
    try {
      const res = await fetch("http://localhost:3000/leyes");
      if (!res.ok) throw new Error("Problemas obteniendo leyes");
      const data = await res.json();
      setLey(data);
    } catch (error) {
      console.error("Error cargando leyes:", error);
    }
  };

  const loadGlosas = async () => {
    try {
      const res = await fetch("http://localhost:3000/glosas");
      if (!res.ok) throw new Error("Problemas obteniendo datos de glosas");
      const data = await res.json();
      setGlosas(data);
    } catch (error) {
      console.error("Error cargando glosas:", error);
    }
  };

  const loadDatosVeh = async () => {
    try {
      const res = await fetch("http://localhost:3000/datos_vehi");
      if (!res.ok) throw new Error("Problemas obteniendo datos de vehículos");
      const data = await res.json();
      setDatosVehiculos(data);
    } catch (error) {
      console.error("Error cargando datos de vehículos", error);
    }
  };

  const loadSectores = async () => {
    try {
      const res = await fetch("http://localhost:3000/sectores");
      if (!res.ok) throw new Error("Problemas obteniendo sectores");
      const data = await res.json();
      setSectores(data);
    } catch (error) {
      console.error("Error cargando sectores", error);
    }
  };

  const loadIdExpedientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/expedientes");
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
    patr_mixto: false,
    patrullero: "",
    id_inspector: "",
    id_patrullero: "",
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
  };

  useEffect(() => {
    loadInspectores();
    loadPatrulleros();
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
    console.log("Datos enviados: ", expedientes);

    if (params.id) {
      const res = await fetch(`http://localhost:3000/exped/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expedientes),
      });
      setEditing(true);
      if (!res.ok) {
        throw new Error("Error de envio de datos");
      }
      navigate(`/inspect/${params.id}/edit`);
    } else {
      const res = await fetch("http://localhost:3000/exped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expedientes),
      });
      if (!res.ok) {
        throw new Error("Error de envio de datos");
      }
      const data = await res.json();
      console.log(data);
      navigate("/inspect/new");
    }
  };

  const handleDeleteExpediente = async () => {
    const id = params.id;

    await fetch(`http://localhost:3000/exped/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updateExpedientes = { ...expedientes };
    delete updateExpedientes[id];
    setExpedientes(updateExpedientes);
    navigate(`/inspect/${lastIdExp}/edit`);
  };

  const handleNewExpediente = () => {
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
    console.log(checked);
  };

  const handleLastExpediente = async () => {
    try {
      const response = await fetch("http://localhost:3000/last/exped");

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
      const response = await fetch("http://localhost:3000/first/exped");

      if (response.ok) {
        const firstExpediente = await response.json();
        console.log(firstExpediente.expediente.id_expediente);
        if (firstExpediente) {
          console.log("Primer expediente:", firstExpediente);
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
      const response = await fetch(
        `http://localhost:3000/exp/prev/${params.id}`
      );
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
      const response = await fetch(
        `http://localhost:3000/exp/next/${params.id}`
      );
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
    setEditing(false);
  };

  const handleCancel = async () => {
    const id = params.id;
    try {
      const response = await fetch("http://localhost:3000/last/exped");

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
    setEditing(true);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleFirstExpediente}
        disabled={disabledPrevButton}
      >
        Primer Expediente
      </button>
      <button
        type="button"
        onClick={handlePrevious}
        disabled={disabledPrevButton}
      >
        Atras
      </button>
      <button type="button" onClick={handleNext} disabled={disabledNextButton}>
        Siguiente
      </button>
      <button
        type="button"
        onClick={handleLastExpediente}
        disabled={disabledNextButton}
      >
        Ultimo Expediente
      </button>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Fecha Infraccion</label>
        <input
          type="datetime-local"
          name="fecha_infraccion"
          value={expedientes.fecha_infraccion}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Fecha Resolucion</label>
        <input
          type="datetime-local"
          name="fecha_resolucion"
          id=""
          value={expedientes.fecha_resolucion}
          onChange={handleChanges}
          disabled={editing}
        />
        <input
          name="user_creador"
          type="text"
          placeholder="Usuario digitador"
          value={expedientes.user_creador}
          onChange={handleChanges}
          disabled={editing}
        />
        <select
          name="tipo_procedimiento"
          id=""
          value={expedientes.tipo_procedimiento || ""}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="">Seleccione procedimiento</option>
          <option value="notificación">Notificación</option>
          <option value="citación">Citación</option>
          <option value="causas">Causas JPL</option>
          <option value="solicitudes">Solicitudes Generales</option>
        </select>
        <label htmlFor="">Fecha de citacion</label>
        <input
          type="datetime-local"
          name="fecha_citacion"
          id=""
          value={expedientes.fecha_citacion}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">¿Empadronado?</label>
        <input
          type="radio"
          name="empadronado"
          id=""
          value={"Sí"}
          checked={expedientes.empadronado === "Sí"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Sí</label>
        <input
          type="radio"
          name="empadronado"
          id=""
          value={"No"}
          checked={expedientes.empadronado === "No"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">No</label>
        <select
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
        <textarea
          name="observaciones"
          id=""
          placeholder="Observaciones"
          value={expedientes.observaciones}
          onChange={handleChanges}
          disabled={editing}
        ></textarea>
        <select
          name="id_inspector"
          id=""
          value={expedientes.id_inspector || ""}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="">Seleccione Inspector</option>
          {inspectores.map((i) => (
            <option key={i.id_funcionario} value={i.id_funcionario}>
              {i.funcionario}
            </option>
          ))}
        </select>
        <select
          name="testigo"
          id=""
          value={expedientes.testigo || ""}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="">Seleccione Testigo</option>
          {testigos.map((insp) => (
            <option key={insp.id_funcionario} value={insp.funcionario}>
              {insp.funcionario}
            </option>
          ))}
        </select>
        <input
          type="checkbox"
          name="patr_mixto"
          id=""
          checked={expedientes.patr_mixto === true}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Patrullaje Mixto</label>
        <select
          name="id_patrullero"
          id=""
          value={expedientes.id_patrullero || ""}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="">Seleccione Patrullero</option>
          {patrulleros.map((p) => (
            <option key={p.id_funcionario} value={p.id_funcionario}>
              {p.funcionario}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="rut_contri"
          placeholder="Rut Contribuyente"
          value={expedientes.rut_contri}
          onChange={handleChanges}
          disabled={editing}
        />
        <input
          type="text"
          name="giro_contri"
          placeholder="Giro del Contribuyente"
          value={expedientes.giro_contri}
          onChange={handleChanges}
          disabled={editing}
        />

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Contribuyente"
          value={expedientes.nombre}
          onChange={handleChanges}
          disabled={editing}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección del Contribuyente"
          value={expedientes.direccion}
          onChange={handleChanges}
          disabled={editing}
        />
        <input
          type="text"
          name="rol_contri"
          placeholder="Rol del Contribuyente"
          value={expedientes.rol_contri}
          onChange={handleChanges}
          disabled={editing}
        />
        <input
          type="text"
          name="direccion_infraccion"
          placeholder="Direccion infraccion"
          value={expedientes.direccion_infraccion}
          onChange={handleChanges}
          disabled={editing}
        />
        <select
          name="sector_infraccion"
          id=""
          value={expedientes.sector_infraccion || ""}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="">Seleccione sector de la infraccion</option>
          {sectores.map((s) => (
            <option key={s.id_sector} value={s.sector}>
              {s.sector}
            </option>
          ))}
        </select>
        <select
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
        <select
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
        <select
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
        <select
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
        <select
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
        <input
          type="text"
          name="ppu"
          placeholder="PPU"
          value={expedientes.ppu}
          onChange={handleChanges}
          disabled={editing}
        />
        <br />
        <br />
        <button type="button" onClick={handleNewExpediente}>
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
          type="button"
          onClick={handleCancel}
          style={{ display: editing ? "none" : "" }}
        >
          Cancelar
        </button>
        <button type="submit" style={{ display: editing ? "none" : "" }}>
          Guardar Expediente
        </button>
        <button type="button" onClick={handleDeleteExpediente}>
          Eliminar
        </button>
      </form>

      <div>
        <BlobProvider document={<InspeccionPDF />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando...</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Generar PDF
              </button>
            )
          }
        </BlobProvider>
      </div>

      <div>
        <AttachFiles />
      </div>
    </div>
  );
}

export default FormInspeccion;
