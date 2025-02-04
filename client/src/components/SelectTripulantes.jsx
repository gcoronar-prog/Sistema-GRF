import React from "react";
import AsyncSelect from "react-select/async";

function SelectTripulantes() {
  const loadTripulantes = async (inputValue) => {
    try {
      const response = await fetch("http://localhost:3000/tripulantes");
      if (!response.ok) {
        throw new Error("Error al cargar los tripulantes");
      }
      const data = await response.json();
      console.log(data);
      return data.map((item) => ({
        value: item.id_funcionario,
        label: item.funcionario,
      }));
    } catch (error) {
      console.error("Error:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  return (
    <div style={{ width: "30%" }}>
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={loadTripulantes}
      />
    </div>
  );
}

export default SelectTripulantes;
