import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm({ formulario }) {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const buscaInforme = async (id) => {
    try {
      const codCentral = "CINF" + id;
      const codInspect = "IPC" + id;
      const res = await fetch(
        formulario === "central"
          ? `${servidor_local}/search_inform?id=${codCentral}`
          : `${servidor_local}/search_exped?id=${codInspect}`
      );
      const data = await res.json();

      if (data.informe.length > 0) {
        navigate(`/informes/central/${id}`);
      } else if (data.expediente.length > 0) {
        navigate(`/expedientes/${id}`);
      } else {
        window.alert("No existen registros con este codigo");
        setCodigo("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const id = e.target.value.toUpperCase();

    setCodigo(id);
  };

  return (
    <>
      <input
        className="form-control me-2"
        id="codigoBusqueda"
        name="codigoBusqueda"
        type="search"
        onChange={handleChanges}
        value={codigo}
        placeholder="Código del informe"
        aria-label="Search"
      />
      <button
        className="btn btn-outline-success"
        onClick={() => buscaInforme(codigo)}
      >
        Buscar
      </button>
    </>
  );
}

export default SearchForm;
