import AsyncSelect from "react-select/async";

function SelectSector({
  selectedSector,
  setSelectedSector,
  edition,
  selectRef,
}) {
  const loadSector = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/sectores`);
      if (!response.ok) {
        throw new Error("Error al cargar los sectores");
      }
      const data = await response.json();
      //console.log(data);
      return data
        .filter((item) =>
          item.sector.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((item) => ({
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
        onChange={(s) => {
          setSelectedSector(s);
        }}
        value={selectedSector}
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: !selectedSector ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedSector && <p style={{ color: "red" }}>Seleccione sector</p>}
      {selectedSector && null}
    </div>
  );
}

export default SelectSector;
