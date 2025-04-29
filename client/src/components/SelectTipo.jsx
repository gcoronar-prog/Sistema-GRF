import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

function SelectTipo({
  selectedTipo,
  setSelectedTipo,
  edition,
  tipo,
  selectRef,
  error,
}) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (tipo?.value) {
      setKey((prevKey) => prevKey + 1);
    }
    //loadTipo();
  }, [tipo]);

  const loadTipo = async (inputValue) => {
    if (!tipo?.value) return [];
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/tipoReporte?grupo_reporte=${
          tipo.label
        }`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      //console.log("select tipo", data.tipo);
      const datos = data.tipo.map((item) => ({
        value: item.id_tipo,
        label: item.descripcion,
      }));
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
        onChange={(selectedOptions) => {
          setSelectedTipo(selectedOptions);
        }}
        value={selectedTipo || null}
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

export default SelectTipo;
