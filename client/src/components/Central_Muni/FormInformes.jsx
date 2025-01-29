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
    console.log(data);
  };
  return <div>FormInformes</div>;
}

export default FormInformes;
