import AsyncSelect from "react-select/async";

function SelectLey({ selectedLey, setSelectedLey, edition, error, selectRef }) {
  const loadLeyes = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/leyes`
      );
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
            borderColor: error ? "red" : base.borderColor,
          }),
        }}
      />
      {error && <p style={{ color: "red" }}>Este campo es obligatorio</p>}
    </div>
  );
}
export default SelectLey;
