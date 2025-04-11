import AsyncSelect from "react-select/async";

function SelectSector({ selectedSector, setSelectedSector, edition }) {
  const loadSector = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/sectores`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los sectores");
      }
      const data = await response.json();
      //console.log(data);
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
    <div>
      <AsyncSelect
        isDisabled={edition}
        cacheOptions
        defaultOptions
        isClearable
        loadOptions={loadSector}
        onChange={(selected) => {
          setSelectedSector(selected);
        }}
        value={selectedSector}
        required
      />
      {selectedSector?.length === 0 && (
        <p style={{ color: "red" }}>Este campo es obligatorio</p>
      )}
    </div>
  );
}

export default SelectSector;
