import AsyncSelect from "react-select/async";

function SelectOrigin({ selectedOrigin, setSelectedOrigin, edition }) {
  const loadOrigin = async (inputValue) => {
    try {
      const response = await fetch("http://localhost:3000/origenes");
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();

      return data.map((item) => ({
        value: item.id_origen,
        label: item.origen,
      }));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  return (
    <div>
      <AsyncSelect
        isDisabled={edition}
        cacheOptions
        defaultOptions
        isClearable
        loadOptions={loadOrigin}
        onChange={(selectedOptions) => {
          setSelectedOrigin(selectedOptions);
        }}
        value={selectedOrigin}
      />
    </div>
  );
}

export default SelectOrigin;
