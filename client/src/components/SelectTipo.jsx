import AsyncSelect from "react-select/async";

function SelectTipo({ selectedTipo, setSelectedTipo, edition }) {
  const loadTipo = async (inputValue) => {
    try {
      const response = await fetch("http://localhost:3000/tipoReportes");
      if (!response.ok) {
        throw new Error("Error al cargar los tripulantes");
      }
      const data = await response.json();

      return data.map((item) => ({
        value: item.id_tipo,
        label: item.descripcion,
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
        cacheOptions
        defaultOptions
        loadOptions={loadTipo}
        onChange={(selectedOptions) => {
          setSelectedTipo(selectedOptions);
        }}
        value={selectedTipo}
      />
    </div>
  );
}

export default SelectTipo;
