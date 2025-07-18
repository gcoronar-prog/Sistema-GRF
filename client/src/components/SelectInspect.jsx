import AsyncSelect from "react-select/async";

function SelectInspect({
  selectedInspect,
  setSelectInspect,
  edition,
  selectRef,
  estadistica,
}) {
  const loadInspect = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/inspectores`);
      if (!response.ok) {
        throw new Error("Error al cargar leyes");
      }
      const data = await response.json();
      //console.log(data);
      return data.map((item) => ({
        value: item.id_funcionario,
        label: item.funcionario,
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
        loadOptions={loadInspect}
        onChange={(selected) => {
          setSelectInspect(selected);
        }}
        value={selectedInspect}
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor:
              !selectedInspect && !estadistica ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedInspect && !estadistica && (
        <p style={{ color: "red" }}>Elija un inspector</p>
      )}
      {selectedInspect && null}
    </div>
  );
}
export default SelectInspect;
