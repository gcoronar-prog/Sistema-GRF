import AsyncSelect from "react-select/async";

function SelectVehiculo({ selectedVehiculo, setSelectedVehiculo }) {
  const loadVehiculo = async (inputValue) => {
    try {
      const response = await fetch("http://localhost:3000/vehiculos");
      const data = await response.json();

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
        onChange={(selectedOptions) => {
          setSelectedVehiculo(selectedOptions);
        }}
        value={selectedVehiculo}
      />
    </div>
  );
}

export default SelectVehiculo;
