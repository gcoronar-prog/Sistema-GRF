import AsyncSelect from "react-select/async";

function SelectInformante({
  selectedInformante,
  setSelectedInformante,
  edition,
  selectRef,
  error
}) {
  const loadInformante = async (inputValue) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informantes`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los tripulantes");
      }
      const data = await response.json();

      return data.map((item) => ({
        value: item.id_informante,
        label: item.informante,
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
        loadOptions={loadInformante}
        onChange={(selectedOptions) => {
          setSelectedInformante(selectedOptions);
        }}
        value={selectedInformante}
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

export default SelectInformante;
