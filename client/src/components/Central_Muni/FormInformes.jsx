import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectVehiculo from "../SelectVehiculo";

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
  const [editing, setEditing] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState([]);

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
    const formattedDate = dayjs(data.informe.fecha_informe).format(
      "YYYY-MM-DDTHH:mm"
    );

    const vehiculosFormateados = Array.isArray(
      data.informe[0].vehiculos_informe
    )
      ? data.informe[0].vehiculos_informe.map((vehiculo) => ({
          value: vehiculo.id_vehiculo, // Ajusta según la estructura real de tu API
          label: vehiculo.vehiculo, // Ajusta según la estructura real de tu API
        }))
      : [];

    const recursosFormateados = Array.isArray(data.informe[0].recursos_informe)
      ? data.informe[0].recursos_informe
      : [];

    console.log(data);

    setInformes({
      //informes
      /*id_informes_central: params.id,
      id_origen_informe: data.informe[0].id_origen_informe,
      id_tipos_informe: data.informe[0].id_tipos_informe,
      id_ubicacion_informe: data.informe[0].id_ubicacion_informe,
      id_vehiculo_informe: data.informe[0].id_vehiculo_informe,*/

      //origen informe
      fecha_informe: formattedDate,
      origen_informe: data.informe[0].origen_informe,
      persona_informante: data.informe[0].persona_informante,
      captura_informe: data.informe[0].captura_informe,
      clasificacion_informe: data.informe[0].clasificacion_informe,
      estado_informe: data.informe[0].estado_informe,

      //tipos informe

      tipo_informe: data.informe[0].tipo_informe,
      otro_tipo: data.informe[0].otro_tipo,
      descripcion_informe: data.informe[0].descripcion_informe,

      //ubicacion informe

      sector_informe: data.informe[0].sector_informe,
      direccion_informe: data.informe[0].direccion_informe,

      //datos vehiculos

      //vehiculos_informe: vehiculosFormateados,
      tripulantes_informe: data.informe[0].tripulantes_informe,
    });

    setSelectedVehiculo(vehiculosFormateados);

    setSelectedValues(recursosFormateados);
  };

  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    setInformes({ ...informes, [name]: type === "checkbox" ? checked : value });
    console.log(name);
    console.log(value);
    console.log(checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const arrayFormateado = `{${selectedValues.join(",")}}`;
    const vehiculosFormateados = selectedVehiculo.map((v) => v.value);
    const datosActualizados = {
      ...informes,
      vehiculos_informe: vehiculosFormateados,
      recursos_informe: arrayFormateado,
    };
    setSelectedValues(arrayFormateado);
    //console.log("Datos enviados", informes);
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
      const lastData = await fetch(
        "http://localhost:3000/informe/central/last"
      );
      const lastInforme = await lastData.json();
      setLastId(lastInforme.informe[0].id_informes_central);
      if (lastInforme && lastInforme.informe[0].id_informes_central) {
        const lastIdInfo = lastInforme.informe[0].id_informes_central;
        navigate(`/informes/central/${lastIdInfo}`);
      }
      const metodo = params.id ? "" : `/informes/central/${lastId + 1}`;
      navigate(metodo);
      setEditing(true);
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
        const id_informe = firstInforme.id_informes_central;
        navigate(`/informes/central/${lastIdInfo}`);
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
        const id_informe = lastInforme.id_informes_central;
        navigate(`/informes/central/${lastIdInfo}`);
      } else {
        console.log("No hay informes");
      }
    } else {
      console.log("Error al obtener informes");
    }
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

  return (
    <div>
      FormInformes
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="fecha_informe">Fecha de informe:</label>
        <input
          type="datetime-local"
          name="fecha_informe"
          onChange={handleChanges}
          value={informes.fecha_informe}
        />
        <label htmlFor="origen_informe">Origen de la información</label>
        <select
          name="origen_informe"
          id="origen_informe"
          onChange={handleChanges}
          value={informes.origen_informe}
        >
          <option value="">Seleccione origen</option>
        </select>
        <label htmlFor="persona_informante">Persona informante</label>
        <select
          name="persona_informante"
          id="persona_informante"
          onChange={handleChanges}
          value={informes.persona_informante}
        >
          <option value="">Seleccione...</option>
        </select>
        <label htmlFor="radios">Radio</label>
        <input
          type="radio"
          name="captura_informe"
          id="radios"
          value={"radios"}
          checked={informes.captura_informe === "radios"}
          onChange={handleChanges}
        />
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="radio"
          name="captura_informe"
          id="telefono"
          value={"telefono"}
          checked={informes.captura_informe === "telefono"}
          onChange={handleChanges}
        />
        <label htmlFor="rrss">RRSS</label>
        <input
          type="radio"
          name="captura_informe"
          id="rrss"
          value={"rrss"}
          checked={informes.captura_informe === "rrss"}
          onChange={handleChanges}
        />
        <label htmlFor="presencial">Presencial</label>
        <input
          type="radio"
          name="captura_informe"
          id="presencial"
          value={"presencial"}
          checked={informes.captura_informe === "presencial"}
          onChange={handleChanges}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="radio"
          name="captura_informe"
          id="email"
          value={"email"}
          checked={informes.captura_informe === "email"}
          onChange={handleChanges}
        />
        <label htmlFor="clasificacion">Clasificación</label>
        <select
          name="clasificacion_informe"
          id="clasificacion"
          onChange={handleChanges}
          value={informes.clasificacion_informe}
        >
          <option value="">Seleccione informe</option>
        </select>
        <label htmlFor="atendido">Atendido</label>
        <input
          type="radio"
          name="estado_informe"
          id="atendido"
          onChange={handleChanges}
          value={"atendido"}
          checked={informes.estado_informe === "atendido"}
        />
        <label htmlFor="progreso">En progreso</label>
        <input
          type="radio"
          name="estado_informe"
          id="progreso"
          onChange={handleChanges}
          value={"progreso"}
          checked={informes.estado_informe === "progreso"}
        />
        <label htmlFor="pendiente">Pendiente</label>
        <input
          type="radio"
          name="estado_informe"
          id="pendiente"
          onChange={handleChanges}
          value={"pendiente"}
          checked={informes.estado_informe === "pendiente"}
        />
        <label htmlFor="tipoInforme">Tipo de informe</label>
        <select
          name="tipo_informe"
          id="tipoInforme"
          onChange={handleChanges}
          value={informes.tipo_informe}
        >
          <option value="">Seleccione tipo de informe</option>
        </select>
        <label htmlFor="otroTipo">Otro tipo de informe:</label>
        <input
          type="text"
          name="otro_tipo"
          id="otroTipo"
          onChange={handleChanges}
          value={informes.otro_tipo}
        />
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          name="descripcion_informe"
          id="descripcion"
          onChange={handleChanges}
          value={informes.descripcion_informe}
        ></textarea>
        <label htmlFor="mixta">Patrullaje Mixto</label>
        <input
          type="checkbox"
          name="recursos_informe"
          id="mixta"
          value={"mixta"}
          checked={selectedValues.includes("mixta")}
          onChange={handleCheckbox}
        />
        <label htmlFor="preventivo">Patrullaje preventivo</label>
        <input
          type="checkbox"
          name="recursos_informe"
          id="preventivo"
          value={"preventivo"}
          checked={selectedValues.includes("preventivo")}
          onChange={handleCheckbox}
        />
        <label htmlFor="sector">Sector:</label>
        <select
          name="sector_informe"
          id="sector"
          onChange={handleChanges}
          value={informes.sector_informe}
        >
          <option value="">Seleccione Sector</option>
        </select>
        <label htmlFor="direccion">Dirección:</label>
        <input
          type="text"
          name="direccion_informe"
          id="direccion"
          onChange={handleChanges}
          value={informes.direccion_informe}
        />
        <label htmlFor="vehiculos">Ingrese vehículos</label>
        <SelectVehiculo
          selectedVehiculo={selectedVehiculo}
          setSelectedVehiculo={setSelectedVehiculo}
        />
        {/*<select
          name="vehiculos_informe"
          id="vehiculos"
          onChange={handleChanges}
          value={informes.vehiculos_informe}
        >
          <option value="">Seleccione vehículos</option>
        </select>*/}
        <label htmlFor="tripu">Ingrese Tripulantes</label>
        <select
          name="tripulantes_informe"
          id="tripu"
          onChange={handleChanges}
          value={informes.tripulantes_informe}
        >
          <option value="">Seleccione Tripulantes</option>
        </select>
        {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
        <button type="button">Nuevo Expediente</button>
        <button type="button" style={{ display: editing ? "" : "none" }}>
          Editar
        </button>
        <button type="submit" style={{ display: editing ? "none" : "" }}>
          Guardar Informe
        </button>
        <button type="button" style={{ display: editing ? "none" : "" }}>
          Cancelar
        </button>
        <button type="button">Eliminar</button>
      </form>
    </div>
  );
}

export default FormInformes;
