import AsyncSelect from "react-select/async";

function SelectJJVV({ selectedJJVV, setSelectedJJVV, edition }) {
  const loadJuntaVecinos = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/jjvv`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();

      return data
        .filter((item) =>
          item.nombre_jjvv.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((item) => ({
          value: item.id_jjvv,
          label: item.nombre_jjvv,
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
        loadOptions={loadJuntaVecinos}
        isClearable
        onChange={(selectedOptions) => {
          setSelectedJJVV(selectedOptions);
        }}
        value={selectedJJVV || null}
      />
    </div>
  );
}

export default SelectJJVV;
