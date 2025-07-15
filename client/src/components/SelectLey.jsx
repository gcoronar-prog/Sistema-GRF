import AsyncSelect from "react-select/async";

function SelectLey({ selectedLey, setSelectedLey, edition, selectRef }) {
  const loadLeyes = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/leyes`);
      if (!response.ok) {
        throw new Error("Error al cargar leyes");
      }
      const data = await response.json();
      //console.log(data);
      return data.map((item) => ({
        value: item.id_ley,
        label: item.ley,
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
        loadOptions={loadLeyes}
        onChange={(selected) => {
          setSelectedLey(selected);
        }}
        value={selectedLey}
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: !selectedLey ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedLey && <p style={{ color: "red" }}>Elija una ley</p>}
      {selectedLey && null}
    </div>
  );
}
export default SelectLey;
