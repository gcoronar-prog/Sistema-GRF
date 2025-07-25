import AsyncSelect from "react-select/async";

function SelectInformante({
  selectedInformante,
  setSelectedInformante,
  edition,
  selectRef,
}) {
  const loadInformante = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/informantes`);
      if (!response.ok) {
        throw new Error("Error al cargar los tripulantes");
      }
      const data = await response.json();

      return data
        .filter((item) =>
          item.informante.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((item) => ({
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
            borderColor: !selectedInformante ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedInformante && (
        <p style={{ color: "red" }}>Seleccione un informante</p>
      )}
      {selectedInformante && null}
    </div>
  );
}

export default SelectInformante;
