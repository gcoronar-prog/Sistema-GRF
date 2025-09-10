import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlobProvider } from "@react-pdf/renderer";
import SGCImagenPDF from "../PDFs/SGCImagenPDF";

function FormSolicitud() {
  const navigate = useNavigate();
  const params = useParams();
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

  const [solicitudes, setSolicitudes] = useState({ defaultSolicitudes });
  const [lastId, setLastId] = useState("");
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadImagenes(params.id);
    } else {
      setSolicitudes(defaultSolicitudes);
    }
  }, [params.id]);

  const loadImagenes = async (id) => {
    const res = await fetch(`${servidor}/imagenes/seg/${id}/edit`);
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();

    const formattedFecha = dayjs(data.soliGrabacion[0].fecha_siniestro).format(
      "YYYY-MM-DDTHH:mm"
    );

    const formattedFechaUser = dayjs(
      data.soliUsuarios[0].fecha_solicitud
    ).format("YYYY-MM-DDTHH:mm");

    setSolicitudes({
      //denuncia usuario
      entidad: data.soliDenuncia[0].entidad,
      num_parte: data.soliDenuncia[0].num_parte,

      //datos solicitud
      descripcion_solicitud: data.soliGrabacion[0].descripcion_solicitud,
      fecha_siniestro: formattedFecha,
      direccion_solicitud: data.soliGrabacion[0].direccion_solicitud,
      sector_solicitud: data.soliGrabacion[0].sector_solicitud,
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
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setSolicitudes({ ...solicitudes, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("datos enviados", solicitudes);

    try {
      const url = params.id
        ? `${servidor}/imagenes/seg/${params.id}/edit`
        : `${servidor}/imagenes/seg/new`;

      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(solicitudes),
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
  };

  const handleEdit = async () => {
    setEditing(false);
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
  };

  const handleDeleteSoli = async () => {
    const id = params.id;
    await fetch(`${servidor}/imagenes/seg/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updatedSoli = { ...solicitudes };
    delete updatedSoli[id];
    setSolicitudes(updatedSoli);

    const res = await fetch(`${servidor}/seg/imagenes/last`);
    const data = await res.json();
    navigate(`/sc/imagenes/${data.ultima[0].id_solicitud}`);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleFirstSoli}
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
        onClick={handleLastSoli}
        disabled={
          false
          //disabledNextButton
        }
      >
        Ultimo
      </button>

      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Datos Solicitante</label>
        <label htmlFor="">Fecha de solicitud</label>
        <input
          type="datetime-local"
          name="fecha_solicitud"
          value={solicitudes.fecha_solicitud}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Rut Solicitante</label>
        <input
          type="text"
          name="rut_solicitante"
          value={solicitudes.rut_solicitante}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Nombre del solicitante</label>
        <input
          type="text"
          name="nombre_solicitante"
          value={solicitudes.nombre_solicitante}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Teléfono solicitante</label>
        <input
          type="text"
          name="telefono_solicitante"
          value={solicitudes.telefono_solicitante}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">E-mail solicitante</label>
        <input
          type="email"
          name="e_mail_solicitante"
          value={solicitudes.e_mail_solicitante}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Datos Responsable</label>
        <label htmlFor="">Nombre Responsable</label>
        <input
          type="text"
          name="nombre_responsable"
          value={solicitudes.nombre_responsable}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Institución</label>
        <input
          type="text"
          name="institucion"
          value={solicitudes.institucion}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Rut Responsable</label>
        <input
          type="text"
          name="rut_responsable"
          value={solicitudes.rut_responsable}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Datos solicitud</label>
        <label htmlFor="">Descripción de la solicitud</label>
        <textarea
          name="descripcion_solicitud"
          id=""
          value={solicitudes.descripcion_solicitud}
          onChange={handleChanges}
          disabled={editing}
        ></textarea>
        <label htmlFor="">Fecha solicitada</label>
        <input
          type="datetime-local"
          name="fecha_siniestro"
          value={solicitudes.fecha_siniestro}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Dirección</label>
        <input
          type="text"
          name="direccion_solicitud"
          value={solicitudes.direccion_solicitud}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="">Sector</label>
        <select
          name="sector_solicitud"
          id=""
          value={solicitudes.sector_solicitud}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="">Seleccione Sector</option>
          <option value="Barrancas">Barrancas</option>
          <option value="San Antonio">San Antonio</option>
        </select>

        <label htmlFor="">Estado de la solicitud</label>
        <input
          type="radio"
          name="estado_solicitud"
          id="pendiente"
          value={"Pendiente"}
          checked={solicitudes.estado_solicitud === "Pendiente"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="pendiente">Pendiente</label>
        <input
          type="radio"
          name="estado_solicitud"
          id="revision"
          value={"Revisión"}
          checked={solicitudes.estado_solicitud === "Revisión"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="revision">Revisión</label>
        <input
          type="radio"
          name="estado_solicitud"
          id="entregada"
          value={"Entregada"}
          checked={solicitudes.estado_solicitud === "Entregada"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="entregada">Entregada</label>
        <input
          type="radio"
          name="estado_solicitud"
          id="nula"
          value={"Nula"}
          checked={solicitudes.estado_solicitud === "Nula"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="nula">Nula</label>
        <label htmlFor="">Datos Denuncia</label>
        <label htmlFor="">Entidad en la que se denuncia</label>
        <select
          name="entidad"
          id=""
          value={solicitudes.entidad}
          onChange={handleChanges}
          disabled={editing}
        >
          <option value="">Seleccione entidad</option>
          <option value="jpl1">JPL 1</option>
          <option value="jpl2">JPL 2</option>
          <option value="carabineros">Carabineros</option>
        </select>

        <label htmlFor="">N° de parte / documento</label>
        <input
          type="text"
          name="num_parte"
          value={solicitudes.num_parte}
          onChange={handleChanges}
          disabled={editing}
        />

        {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
        <button type="button" onClick={handleNewSoli}>
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
          onClick={handleCancel}
          style={{ display: editing ? "none" : "" }}
        >
          Cancelar
        </button>
        <button type="button" onClick={handleDeleteSoli}>
          Eliminar
        </button>
      </form>
      <div>
        <BlobProvider document={<SGCImagenPDF />}>
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
    </div>
  );
}

export default FormSolicitud;
