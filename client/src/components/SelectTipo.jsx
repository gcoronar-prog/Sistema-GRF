import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

function SelectTipo({ selectedTipo, setSelectedTipo, edition, tipo }) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (tipo?.value) {
      console.log("Tipo seleccionado:", tipo.label);
      setKey((prevKey) => prevKey + 1);
    }
    //loadTipo();
  }, [tipo]);

  const loadTipo = async (inputValue) => {
    if (!tipo?.value) return [];
    try {
      const response = await fetch(
        `http://localhost:3000/tipoReporte?grupo_reporte=${tipo.label}`
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
      console.log("asyncselect", datos);
      return datos;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  return (
    <div style={{ width: "30%" }}>
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
      />
    </div>
  );
}

export default SelectTipo;
