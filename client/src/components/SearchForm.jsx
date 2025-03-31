import React, { useEffect } from "react";

function SearchForm() {
  useEffect(() => {
    buscaInforme("CINF31");
  }, []);

  const buscaInforme = async (id) => {
    const res = await fetch(`http://localhost:3000/search_informe?id=${id}`);
    const data = res.json();

    console.log("Busqueda informe", data);
  };

  return <></>;
}

export default SearchForm;
