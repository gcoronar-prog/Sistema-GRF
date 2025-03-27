import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AttachFiles from "../AttachFiles";
import FormAcciones from "../FormAcciones";
import { BlobProvider } from "@react-pdf/renderer";
import SCAtencionPDF from "../PDFs/SCAtencionPDF";

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
  const navigate = useNavigate();
  const params = useParams();

  const [atenciones, setAtenciones] = useState({ defaultAtencion });
  const [editing, setEditing] = useState(true);
  const [lastId, setLastId] = useState("");

  useEffect(() => {
    console.log(params);
    console.log(params.id);
    if (params.id) {
      loadAtenciones(params.id);
    } else {
      setAtenciones(defaultAtencion);
    }
  }, [params.id]);

  const loadAtenciones = async (id) => {
    const res = await fetch(`http://localhost:3000/atenciones/${id}/sgc`);
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
      sector_solicitante: data.sector[0].sector_solicitante,
      poblacion_solicitante: data.sector[0].poblacion_solicitante,
      junta_vecinos: data.sector[0].junta_vecinos,

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
  };

  const handleChanges = async (e) => {
    const { name, value } = e.target;
    setAtenciones({ ...atenciones, [name]: value });
    //console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(atenciones);

    try {
      const idAten = params.id;
      const url = idAten
        ? `http://localhost:3000/atenciones/${params.id}/sgc`
        : "http://localhost:3000/atenciones/sgc";
      const method = idAten ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atenciones),
      });
      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const lastAtencionData = await fetch(
        "http://localhost:3000/atenciones/sgc/last"
      );

      const lastAtencion = await lastAtencionData.json();
      setLastId(lastAtencion.atencion_ciudadana[0].id_atencion);

      if (lastAtencion && lastAtencion.atencion_ciudadana[0]) {
        const idAtencionFinal =
          lastAtencion.atencion_ciudadana[0].atencion_ciudadana;
        navigate(`/sgc/atencion/${idAtencionFinal + 1}`);
      }

      const metodo = idAten ? "" : `/sgc/atencion/${lastId + 1}`;
      navigate(metodo);
      setEditing(true);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ mesasge: "Problemas de conexión con el servidor" });
    }
    setEditing(true);
  };

  const handleFirstAten = async () => {
    const res = await fetch("http://localhost:3000/atenciones/sgc/first");
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
    const res = await fetch("http://localhost:3000/atenciones/sgc/last");
    if (res.ok) {
      const lastAten = await res.json();
      if (lastAten) {
        const id_aten = lastAten.atencion_ciudadana[0].id_atencion;
        navigate(`/sgc/atencion/${id_aten}`);
      } else {
        console.log("No hay registros");
      }
    } else {
      console.log("Error obteniendo datos");
    }
  };

  const handlePrevious = async () => {
    const id = params.id;
    try {
      const response = await fetch(
        `http://localhost:3000/atenciones/${id}/sgc/prev`
      );
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
      const response = await fetch(
        `http://localhost:3000/atenciones/${id}/sgc/next`
      );
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
    navigate("/sgc/atencion/new");
    setEditing(false);
  };

  const handleEdit = async () => {
    setEditing(false);
  };

  const handleDeleteAten = async () => {
    const id = params.id;
    await fetch(`http://localhost:3000/atenciones/${id}/sgc`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updatedAten = { ...atenciones };
    delete updatedAten[id];
    setAtenciones(updatedAten);

    const res = await fetch("http://localhost:3000/atenciones/sgc/last");
    const data = await res.json();
    navigate(`/sgc/atencion/${data.atencion_ciudadana[0].id_atencion}`);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleFirstAten}
        disabled={
          //disabledPrevButton
          false
        }
      >
        Primera solicitud
      </button>
      <button
        type="button"
        onClick={handlePrevious}
        disabled={
          //disabledPrevButton
          false
        }
      >
        Atras
      </button>
      <button
        type="button"
        onClick={handleNext}
        disabled={
          //disabledNextButton
          false
        }
      >
        Siguiente
      </button>
      <button
        type="button"
        onClick={handleLastAten}
        disabled={
          false
          //disabledNextButton
        }
      >
        Ultimo
      </button>
      <input
        type="text"
        name="id_atencion"
        value={atenciones.cod_atencion}
        disabled
      />
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Datos solicitud</label>
        <label htmlFor="">Fecha Solicitud</label>
        <input
          type="datetime-local"
          name="fecha_solicitud"
          id=""
          onChange={handleChanges}
          value={atenciones.fecha_solicitud}
          disabled={editing}
        />
        <label htmlFor="">Estado de la solicitud</label>
        <select
          name="estado_solicitud"
          id=""
          onChange={handleChanges}
          value={atenciones.estado_solicitud}
          disabled={editing}
        >
          <option value="en proceso">En proceso</option>
          <option value="en seguimiento">En seguimiento</option>
          <option value="visitado">Visitado</option>
          <option value="atendido">Atendido</option>
          <option value="derivado">Derivado</option>
          <option value="desistido">Desistido</option>
          <option value="anulado">Anulado</option>
        </select>
        <label htmlFor="">Responsable atención</label>
        <select
          name="responsable_solicitud"
          id=""
          onChange={handleChanges}
          value={atenciones.responsable_solicitud}
          disabled={editing}
        >
          <option value="">Seleccione responsable</option>
          <option value="giordana">María Giordana Ortiz</option>
        </select>
        <label htmlFor="">Medio de atención</label>
        <select
          name="medio_atencion"
          id=""
          onChange={handleChanges}
          value={atenciones.medio_atencion}
          disabled={editing}
        >
          <option value="">Seleccione el medio de atención</option>
          <option value="presencial">Presencial</option>
        </select>
        <label htmlFor="">Tipo de solicitud</label>
        <select
          name="tipo_solicitud"
          id=""
          onChange={handleChanges}
          value={atenciones.tipo_solicitud}
          disabled={editing}
        >
          <option value="">Seleccione tipo</option>
          <option value="peticion">Petición</option>
        </select>
        <textarea
          name="temas_atencion"
          id=""
          onChange={handleChanges}
          value={atenciones.temas_atencion}
          disabled={editing}
        ></textarea>
        <label htmlFor="">Datos usuario</label>
        <label htmlFor="">Rut usuario</label>
        <input
          type="text"
          name="rut_solicitante"
          onChange={handleChanges}
          value={atenciones.rut_solicitante}
          disabled={editing}
        />
        <label htmlFor="">Nombre solicitante</label>
        <input
          type="text"
          name="nombre_solicitante"
          onChange={handleChanges}
          value={atenciones.nombre_solicitante}
          disabled={editing}
        />
        <label htmlFor="">Teléfono</label>
        <input
          type="text"
          name="telefono_solicitante"
          onChange={handleChanges}
          value={atenciones.telefono_solicitante}
          disabled={editing}
        />
        <label htmlFor="">Correo eléctronico</label>
        <input
          type="email"
          name="correo_solicitante"
          onChange={handleChanges}
          value={atenciones.correo_solicitante}
          disabled={editing}
        />
        <label htmlFor="">Dirección</label>
        <input
          type="text"
          name="direccion_solicitante"
          onChange={handleChanges}
          value={atenciones.direccion_solicitante}
          disabled={editing}
        />
        <label htmlFor="">Sector</label>
        <select
          name="sector_solicitante"
          id=""
          onChange={handleChanges}
          value={atenciones.sector_solicitante}
          disabled={editing}
        >
          <option value="">Seleccione sector</option>
        </select>
        <label htmlFor="">Población</label>
        <select
          name="poblacion_solicitante"
          id=""
          onChange={handleChanges}
          value={atenciones.poblacion_solicitante}
          disabled={editing}
        >
          <option value="">Seleccione población</option>
        </select>
        <label htmlFor="">Junta de vecinos</label>
        <select
          name="junta_vecinos"
          id=""
          onChange={handleChanges}
          value={atenciones.junta_vecinos}
          disabled={editing}
        >
          <option value="">Seleccione junta de vecinos</option>
        </select>
        <textarea
          name="descripcion_solicitud"
          id=""
          onChange={handleChanges}
          value={atenciones.descripcion_solicitud}
          disabled={editing}
        ></textarea>
        <textarea
          name="observaciones_solicitud"
          id=""
          onChange={handleChanges}
          value={atenciones.observaciones_solicitud}
          disabled={editing}
        ></textarea>
        <textarea
          name="medidas_seguridad"
          id=""
          onChange={handleChanges}
          value={atenciones.medidas_seguridad}
          disabled={editing}
        ></textarea>
        <textarea
          name="espacios_publicos"
          id=""
          onChange={handleChanges}
          value={atenciones.espacios_publicos}
          disabled={editing}
        ></textarea>

        {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
        <button type="button" onClick={handleNewAten}>
          Nuevo Expediente
        </button>
        <button
          type="button"
          onClick={handleEdit}
          style={{ display: editing ? "" : "none" }}
        >
          Editar
        </button>
        <button type="submit" style={{ display: editing ? "none" : "" }}>
          Guardar Informe
        </button>
        <button
          type="button"
          onClick={handleLastAten}
          style={{ display: editing ? "none" : "" }}
        >
          Cancelar
        </button>
        <button type="button" onClick={handleDeleteAten}>
          Eliminar
        </button>
      </form>
      <div>
        <BlobProvider document={<SCAtencionPDF />}>
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

      {params.id ? (
        <div>
          <AttachFiles />
          <FormAcciones tipo={"seguridad"} />{" "}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FormAtencion;
