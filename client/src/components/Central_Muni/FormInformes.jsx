import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
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
import NavbarSGF from "../NavbarSGF";

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
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (params.id) {
      loadInformes(params.id);
    } else {
      setInformes(defaultInformes);
    }
  }, [params.id]);

  const loadInformes = async (id) => {
    const response = await fetch(
      `http://localhost:3000/informes_central/${id}`
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
    setRefresh((prev) => !prev);
    /*const arrayFormateado = Array.isArray(selectedValues)
      ? selectedValues.join(", ")
      : [];*/
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
    console.log("Datos a enviar:", JSON.stringify(datosActualizados, null, 2));

    try {
      const url = params.id
        ? `http://localhost:3000/informes_central/${params.id}`
        : "http://localhost:3000/informes_central";

      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });
      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      if (!params.id) {
        const lastData = await fetch(
          "http://localhost:3000/informe/central/last"
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
    const res = await fetch("http://localhost:3000/informe/central/first");
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
    const res = await fetch("http://localhost:3000/informe/central/last");
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
        `http://localhost:3000/informe/central/${id}/prev`
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
        `http://localhost:3000/informe/central/${id}/next`
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
  };

  const handleDeleteInforme = async () => {
    const id = params.id;
    await fetch(`http://localhost:3000/informes_central/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const updatedInforme = { ...informes };
    delete updatedInforme[id];
    setInformes(updatedInforme);

    const res = await fetch("http://localhost:3000/informe/central/last");
    const data = await res.json();
    const idInforme = data.informe[0].id_informes_central;
    navigate(`/informes/central/${idInforme}`);
  };

  return (
    <div>
      FormInformes
      <NavbarSGF />
      <button
        type="button"
        onClick={handleFirstInforme}
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
        onClick={handleLastInforme}
        disabled={
          false
          //disabledNextButton
        }
      >
        Ultimo
      </button>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="fecha_informe">Fecha de informe:</label>
        <input
          type="datetime-local"
          name="fecha_informe"
          onChange={handleChanges}
          value={informes.fecha_informe}
          disabled={editing}
        />
        <label htmlFor="origen_informe">Origen de la información</label>
        <SelectOrigin
          edition={editing}
          selectedOrigin={selectedOrigin}
          setSelectedOrigin={setSelectedOrigin}
        />

        <label htmlFor="persona_informante">Persona informante</label>
        <SelectInformante
          edition={editing}
          selectedInformante={selectedInformante}
          setSelectedInformante={setSelectedInformante}
        />

        <label htmlFor="radios">Radio</label>
        <input
          type="radio"
          name="captura_informe"
          id="radios"
          value={"radios"}
          checked={informes.captura_informe === "radios"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="radio"
          name="captura_informe"
          id="telefono"
          value={"telefono"}
          checked={informes.captura_informe === "telefono"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="rrss">RRSS</label>
        <input
          type="radio"
          name="captura_informe"
          id="rrss"
          value={"rrss"}
          checked={informes.captura_informe === "rrss"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="presencial">Presencial</label>
        <input
          type="radio"
          name="captura_informe"
          id="presencial"
          value={"presencial"}
          checked={informes.captura_informe === "presencial"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="radio"
          name="captura_informe"
          id="email"
          value={"email"}
          checked={informes.captura_informe === "email"}
          onChange={handleChanges}
          disabled={editing}
        />
        <label htmlFor="clasificacion">Clasificación</label>
        <SelectClasifica
          selectedClasif={selectedClasif}
          setSelectedClasif={setSelectedClasif}
          edition={editing}
        />
        <label htmlFor="atendido">Atendido</label>
        <input
          type="radio"
          name="estado_informe"
          id="atendido"
          onChange={handleChanges}
          value={"atendido"}
          checked={informes.estado_informe === "atendido"}
          disabled={editing}
        />
        <label htmlFor="progreso">En progreso</label>
        <input
          type="radio"
          name="estado_informe"
          id="progreso"
          onChange={handleChanges}
          value={"progreso"}
          checked={informes.estado_informe === "progreso"}
          disabled={editing}
        />
        <label htmlFor="pendiente">Pendiente</label>
        <input
          type="radio"
          name="estado_informe"
          id="pendiente"
          onChange={handleChanges}
          value={"pendiente"}
          checked={informes.estado_informe === "pendiente"}
          disabled={editing}
        />
        <label htmlFor="tipoInforme">Tipo de informe</label>
        <SelectTipo
          edition={editing}
          selectedTipo={selectedTipo}
          setSelectedTipo={setSelectedTipo}
          tipo={selectedClasif}
        />

        {informes.tipo_informe == "Otro" ? (
          <>
            <label htmlFor="otroTipo">Otro tipo de informe:</label>
            <input
              type="text"
              name="otro_tipo"
              id="otroTipo"
              onChange={handleChanges}
              value={informes.otro_tipo}
              disabled={editing}
            />
          </>
        ) : (
          ""
        )}
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          name="descripcion_informe"
          id="descripcion"
          onChange={handleChanges}
          value={informes.descripcion_informe}
          disabled={editing}
        ></textarea>

        <label htmlFor="">Recursos Involucrados:</label>
        <SelectRecursos
          edition={editing}
          selectedRecursos={selectedRecursos}
          setSelectedRecursos={setSelectedRecursos}
        />
        <label htmlFor="sector">Sector:</label>
        <SelectSector
          edition={editing}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
        />
        <label htmlFor="direccion">Dirección:</label>
        <input
          type="text"
          name="direccion_informe"
          id="direccion"
          onChange={handleChanges}
          value={informes.direccion_informe}
          disabled={editing}
        />
        <label htmlFor="vehiculos">Ingrese vehículos</label>
        <SelectVehiculo
          edition={editing}
          selectedVehiculo={selectedVehiculo}
          setSelectedVehiculo={setSelectedVehiculo}
        />

        <label htmlFor="tripu">Ingrese Tripulantes</label>
        <SelectTripulantes
          edition={editing}
          selectedTripulante={selectedTripulante}
          setSelectedTripulante={setSelectedTripulante}
        />

        {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}

        <button type="button" onClick={handleNewInform}>
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
          style={{ display: editing ? "none" : "" }}
          onClick={handleCancel}
        >
          Cancelar
        </button>
        <button type="button" onClick={handleDeleteInforme}>
          Eliminar
        </button>
      </form>
      {selectedClasif.value === 1 ? <FormAcciones tipo="central" /> : ""}
      <button onClick={() => CentralPDF(params.id)}>Descargar PDF</button>
      <div>
        <ListPendiente refresh={refresh} />
      </div>
      <div>{editing ? <AttachFiles /> : ""}</div>
    </div>
  );
}

export default FormInformes;
