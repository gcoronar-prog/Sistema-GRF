import AsyncSelect from "react-select/async";

function SelectOrigin({
  selectedOrigin,
  setSelectedOrigin,
  edition,

  selectRef,
}) {
  const loadOrigin = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/origenes`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();

      return data
        .filter((item) =>
          item.origen.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((item) => ({
          value: item.id_origen,
          label: item.origen,
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
        loadOptions={loadOrigin}
        isClearable
        onChange={(selectedOptions) => {
          setSelectedOrigin(selectedOptions);
        }}
        value={selectedOrigin || null}
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: !selectedOrigin ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedOrigin && (
        <p style={{ color: "red" }}>Seleccione origen de la información</p>
      )}
      {selectedOrigin && null}
    </div>
  );
}

export default SelectOrigin;
