import AsyncSelect from "react-select/async";

function SelectVehiculo() {
  const loadVehiculo = async (inputValue) => {
    try {
      const response = await fetch("http://localhost:3000/vehiculos");
      const data = await response.json();
      console.log(data);
      return data.map((item) => ({
        value: item.id_vehiculo,
        label: item.vehiculo,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    <div style={{ width: "30%" }}>
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={loadVehiculo}
      />
    </div>
  );
}

export default SelectVehiculo;

/*
import React from "react";
import AsyncSelect from "react-select/async";

function SelectVehiculo() {
  const loadVehiculo = async (inputValue) => {
    try {
      const response = await fetch("http://localhost:3000/vehiculos");
      if (!response.ok) {
        throw new Error("Error al cargar los vehículos");
      }
      const data = await response.json();
      console.log(data);
      return data.map((item) => ({
        value: item.id_vehiculo,
        label: item.vehiculo,
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
        defaultOptions // Carga opciones por defecto al inicio
        loadOptions={loadVehiculo}
      />
    </div>
  );
}

export default SelectVehiculo;
*/
