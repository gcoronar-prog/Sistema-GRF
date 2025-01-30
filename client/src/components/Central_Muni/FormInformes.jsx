import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  const [informes, setInformes] = useState({ defaultInformes });
  const [lastId, setLastId] = useState("");

  useEffect(() => {
    loadInformes(params.id);
  }, [params.id]);

  const loadInformes = async (id) => {
    const response = await fetch(
      `http://localhost:3000/informes_central/${id}`
    );
    const data = await response.json();
    const formattedDate = dayjs(data.informe.fecha_informe).format(
      "YYYY-MM-DDTHH:mm"
    );
    setInformes({
      //informes
      id_informes_central: params.id,
      id_origen_informe: data.informe.id_origen_informe,
      id_tipos_informe: data.informe.id_tipos_informe,
      id_ubicacion_informe: data.informe.id_ubicacion_informe,
      id_vehiculo_informe: data.informe.id_vehiculo_informe,

      //origen informe
      fecha_informe: formattedDate,
      origen_informe: data.informe.origen_informe,
      persona_informante: data.informe.persona_informante,
      captura_informe: data.informe.captura_informe,
      clasificacion_informe: data.informe.clasificacion_informe,
      estado_informe: data.informe.estado_informe,

      //tipos informe

      tipo_informe: data.informe.tipo_informe,
      otro_tipo: data.informe.otro_tipo,
      descripcion_informe: data.informe.descripcion_informe,
      recursos_informe: data.informe.recursos_informe,

      //ubicacion informe

      sector_informe: data.informe.sector_informe,
      direccion_informe: data.informe.direccion_informe,

      //datos vehiculos

      vehiculos_informe: data.informe.vehiculos_informe,
      tripulantes_informe: data.informe.tripulantes_informe,
    });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setInformes({ ...informes, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados", informes);
    try {
      const url = params.id
        ? `http://localhost:3000/informes_central/${id}`
        : "http://localhost:3000/informes_central";

      const method = params.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(informes),
      });
      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }
      const lastData = await fetch(
        "http://localhost:3000/informe/central/last"
      );
      const lastInforme = await lastData.json();
      setLastId(lastInforme.id_informes_central);
      if (lastInforme && lastInforme.id_informes_central) {
        const lastIdInfo = lastInforme.id_informes_central;
        navigate(`/informes/central/${lastIdInfo}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      FormInformes
      <label htmlFor="fecha_informe">Fecha de informe:</label>
      <input type="datetime-local" name="fecha_informe" />
      <label htmlFor="origen_informe">Origen de la información</label>
      <select name="origen_informe" id="origen_informe">
        <option value="">Seleccione origen</option>
      </select>
      <label htmlFor="persona_informante">Persona informante</label>
      <select name="persona_informante" id="persona_informante">
        <option value="">Seleccione...</option>
      </select>
      <label htmlFor="radios">Radio</label>
      <input type="radio" name="captura_informe" id="radios" />
      <label htmlFor="telefono">Teléfono</label>
      <input type="radio" name="captura_informe" id="telefono" />
      <label htmlFor="rrss">RRSS</label>
      <input type="radio" name="captura_informe" id="rrss" />
      <label htmlFor="presencial">Presencial</label>
      <input type="radio" name="captura_informe" id="presencial" />
      <label htmlFor="email">E-mail</label>
      <input type="radio" name="captura_informe" id="email" />
      <label htmlFor="clasificacion">Clasificación</label>
      <select name="clasificacion_informe" id="clasificacion">
        <option value="">Seleccione informe</option>
      </select>
      <label htmlFor="atendido">Atendido</label>
      <input type="radio" name="estado_informe" id="atendido" />
      <label htmlFor="progreso">En progreso</label>
      <input type="radio" name="estado_informe" id="progreso" />
      <label htmlFor="pendiente">Pendiente</label>
      <input type="radio" name="estado_informe" id="pendiente" />
      <label htmlFor="tipoInforme">Tipo de informe</label>
      <select name="tipo_informe" id="tipoInforme">
        <option value="">Seleccione tipo de informe</option>
      </select>
      <label htmlFor="otroTipo">Otro tipo de informe:</label>
      <input type="text" name="otro_tipo" id="otroTipo" />
      <label htmlFor="descripcion">Descripción:</label>
      <textarea name="descripcion_informe" id="descripcion"></textarea>
      <label htmlFor="mixta">Patrullaje Mixto</label>
      <input type="checkbox" name="recursos_informe" id="mixta" />
      <label htmlFor="preventivo">Patrullaje preventivo</label>
      <input type="checkbox" name="recursos_informe" id="preventivo" />
      <label htmlFor="sector">Sector:</label>
      <select name="sector_informe" id="sector">
        <option value="">Seleccione Sector</option>
      </select>
      <label htmlFor="direccion">Dirección:</label>
      <input type="text" name="direccion_informe" id="direccion" />
      <label htmlFor="vehiculos">Ingrese vehículos</label>
      <select name="vehiculos_informe" id="vehiculos">
        <option value="">Seleccione vehículos</option>
      </select>
      <label htmlFor="tripu">Ingrese Tripulantes</label>
      <select name="tripulantes_informe" id="tripu">
        <option value="">Seleccione Tripulantes</option>
      </select>
    </div>
  );
}

export default FormInformes;
