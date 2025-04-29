import AsyncSelect from "react-select/async";

function SelectOrigin({
  selectedOrigin,
  setSelectedOrigin,
  edition,
  error,
  selectRef,
}) {
  const loadOrigin = async (inputValue) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/origenes`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();

      return data.map((item) => ({
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
        onChange={(selectedOptions) => {
          setSelectedOrigin(selectedOptions);
        }}
        value={selectedOrigin || null}
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: error ? "red" : base.borderColor,
          }),
        }}
      />
      {error && <p style={{ color: "red" }}>Este campo es obligatorio</p>}
    </div>
  );
}

export default SelectOrigin;
