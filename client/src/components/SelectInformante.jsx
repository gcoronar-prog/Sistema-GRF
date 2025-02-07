import AsyncSelect from "react-select/async";

function SelectInformante({
  selectedInformante,
  setSelectedInformante,
  edition,
}) {
  const loadInformante = async (inputValue) => {
    try {
      const response = await fetch("http://localhost:3000/informantes");
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
    <div style={{ width: "30%" }}>
      <AsyncSelect
        isDisabled={edition}
        cacheOptions
        defaultOptions
        loadOptions={loadInformante}
        onChange={(selectedOptions) => {
          setSelectedInformante(selectedOptions);
        }}
        value={selectedInformante}
      />
    </div>
  );
}

export default SelectInformante;
