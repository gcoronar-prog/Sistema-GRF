import AsyncSelect from "react-select/async";

function SelectTripulantes({
  selectedTripulante,
  setSelectedTripulante,
  edition,
}) {
  const loadTripulantes = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/tripulantes`);
      console.log(response);
      if (!response.ok) {
        throw new Error("Error al cargar los tripulantes");
      }
      const data = await response.json();
      console.log(data);
      return data
        .filter((item) =>
          item.funcionario.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((item) => ({
          value: item.id_funcionario,
          label: item.funcionario,
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
        isMulti
        closeMenuOnSelect={false}
        loadOptions={loadTripulantes}
        cacheOptions
        defaultOptions
        onChange={(selectedOptions) => {
          setSelectedTripulante(selectedOptions);
        }}
        value={selectedTripulante}
      />
    </div>
  );
}

export default SelectTripulantes;
