import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

function SelectTipo({
  selectedTipo,
  setSelectedTipo,
  edition,
  tipo,
  selectRef,
}) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (tipo?.value) {
      setKey((prevKey) => prevKey + 1);
    }
    //loadTipo();
  }, [tipo]);

  const loadTipo = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    if (!tipo?.value) return [];
    try {
      const response = await fetch(
        `${servidor}/tipoReporte?grupo_reporte=${tipo.label}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      //console.log("select tipo", data.tipo);
      const datos = data.tipo
        .map((item) => ({
          value: item.id_tipo,
          label: item.descripcion,
        }))
        .filter((item) =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        );
      //console.log("asyncselect", datos);
      return datos;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  return (
    <div>
      <AsyncSelect
        key={key}
        isDisabled={edition}
        cacheOptions
        loadOptions={loadTipo}
        defaultOptions
        isClearable
        onChange={(selectedOptions) => {
          setSelectedTipo(selectedOptions);
        }}
        value={selectedTipo}
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: !selectedTipo ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedTipo && <p style={{ color: "red" }}>Ingrese tipo de informe</p>}
      {selectedTipo && null}
    </div>
  );
}

export default SelectTipo;
