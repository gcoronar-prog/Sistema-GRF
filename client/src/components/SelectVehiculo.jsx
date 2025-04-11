import { useCallback } from "react";
import AsyncSelect from "react-select/async";

function SelectVehiculo({ selectedVehiculo, setSelectedVehiculo, edition }) {
  const loadVehiculo = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/vehiculos`
      );
      const data = await response.json();

      return data.map((item) => ({
        value: item.id_vehiculo,
        label: item.vehiculo,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  return (
    <div>
      <AsyncSelect
        isDisabled={edition}
        isMulti
        closeMenuOnSelect={false}
        cacheOptions
        defaultOptions
        loadOptions={loadVehiculo}
        onChange={(selectedOptions) => {
          setSelectedVehiculo(selectedOptions);
        }}
        value={selectedVehiculo || "[]"}
      />
    </div>
  );
}

export default SelectVehiculo;
