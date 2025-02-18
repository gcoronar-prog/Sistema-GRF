import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

function SelectTipo({ selectedTipo, setSelectedTipo, edition, tipo }) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    console.log("Tipo seleccionado:", tipo);
    setKey((prevKey) => prevKey + 1);
  }, [tipo]);

  const loadTipo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/tipoReporte?grupo=${tipo}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();

      return data.map((item) => ({
        value: item.id_tipo,
        label: item.descripcion,
      }));
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
        defaultOptions
        loadOptions={loadTipo}
        onChange={(selectedOptions) => {
          setSelectedTipo(selectedOptions);
        }}
        value={selectedTipo}
      />
    </div>
  );
}

export default SelectTipo;
