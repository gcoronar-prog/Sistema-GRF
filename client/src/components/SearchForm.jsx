import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const buscaInforme = async (id) => {
    try {
      const codCentral = "CINF" + id;
      const res = await fetch(
        `http://localhost:3000/search_inform?id=${codCentral}`
      );
      const data = await res.json();

      if (data.informe.length > 0) {
        navigate(`/informes/central/${id}`);
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
    <div>
      <label htmlFor="">Codigo informe</label>
      <input
        name="codigoBusqueda"
        type="text"
        onChange={handleChanges}
        value={codigo}
      />
      <button onClick={() => buscaInforme(codigo)}>Buscar</button>
    </div>
  );
}

export default SearchForm;
