import AsyncSelect from "react-select/async";

function SelectPoblacion({ selectedPobla, setSelectedPobla, edition }) {
  const loadPoblacion = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/poblaciones`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      return data
        .filter((item) =>
          item.poblacion.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((item) => ({
          value: item.id_poblacion,
          label: item.poblacion,
        }));
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };
  return (
    <div>
      <AsyncSelect
        isDisabled={edition}
        cacheOptions
        defaultOptions
        loadOptions={loadPoblacion}
        isClearable
        onChange={(selectedOptions) => {
          setSelectedPobla(selectedOptions);
        }}
        value={selectedPobla || null}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: !selectedPobla ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedPobla && <p style={{ color: "red" }}>Seleccione población</p>}
      {selectedPobla && null}
    </div>
  );
}

export default SelectPoblacion;
