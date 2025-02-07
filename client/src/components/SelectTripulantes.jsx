import AsyncSelect from "react-select/async";

function SelectTripulantes({
  selectedTripulante,
  setSelectedTripulante,
  edition,
}) {
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
      return [];
    }
  };

  return (
    <div style={{ width: "30%" }}>
      <AsyncSelect
        isDisabled={edition}
        isMulti
        closeMenuOnSelect={false}
        cacheOptions
        defaultOptions
        loadOptions={loadTripulantes}
        onChange={(selectedOptions) => {
          setSelectedTripulante(selectedOptions);
        }}
        value={selectedTripulante}
      />
    </div>
  );
}

export default SelectTripulantes;
