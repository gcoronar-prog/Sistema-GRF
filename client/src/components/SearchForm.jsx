import React, { useState } from "react";

function SearchForm() {
  const [codigo, setCodigo] = useState("");
  const buscaInforme = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/search_inform?id=${id}`);
      const data = await res.json();

      console.log("Busqueda informe", data.informe);

      //agregar un navigate
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
      <input type="text" onChange={handleChanges} value={codigo} />
      <button onClick={() => buscaInforme(codigo)}>Buscar</button>
    </div>
  );
}

export default SearchForm;
