import AsyncSelect from "react-select/async";

function SelectSector({ selectedSector, setSelectedSector, edition }) {
  const loadSector = async () => {
    try {
      const response = await fetch("http://localhost:3000/sectores");
      if (!response.ok) {
        throw new Error("Error al cargar los tripulantes");
      }
      const data = await response.json();

      return data.map((item) => ({
        value: item.id_sector,
        label: item.sector,
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
        loadOptions={loadSector}
        onChange={(selectedOptions) => {
          setSelectedSector(selectedOptions);
        }}
        value={selectedSector}
      />
    </div>
  );
}

export default SelectSector;
