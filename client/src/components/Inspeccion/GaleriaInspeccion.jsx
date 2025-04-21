import React, { useEffect, useState } from "react";

function GaleriaInspeccion() {
  const [listaImagen, setListaImagen] = useState([]);
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  useEffect(() => {
    loadListaImagen();
  }, []);
  const loadListaImagen = async () => {
    try {
      const res = await fetch(`${servidor_local}/listaImagen`);
      const data = await res.json();
      setListaImagen(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return <div>galeriaInspeccion</div>;
}

export default GaleriaInspeccion;
