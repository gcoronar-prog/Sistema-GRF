import AsyncSelect from "react-select/async";

function SelectVehContri({
  selectedVeh,
  setSelectVeh,
  edition,
  error,
  selectRef,
  tipo,
}) {
  const loadVehi = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/datos_vehi`);
      if (!response.ok) {
        throw new Error("Error al cargar leyes");
      }
      const data = await response.json();
      //console.log(data);
      if (tipo === "marca") {
        return data.map((item) => ({
          value: item.marca,
          label: item.marca,
        }));
      } else if (tipo === "tipo") {
        return data.map((item) => ({
          value: item.tipo,
          label: item.tipo,
        }));
      }
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
        loadOptions={loadVehi}
        onChange={(selected) => {
          setSelectVeh(selected);
        }}
        value={selectedVeh}
        ref={selectRef}
      />
    </div>
  );
}
export default SelectVehContri;
