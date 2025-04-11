import AsyncSelect from "react-select/async";
import React from "react";

const SelectRecursos = ({ selectedRecursos, setSelectedRecursos, edition }) => {
  const loadRecursos = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/recursos`
    );
    const data = await res.json();

    return data.map((item) => ({
      value: item.id_recursos,
      label: item.recursos,
    }));
  };

  return (
    <div>
      <AsyncSelect
        isDisabled={edition}
        isMulti
        closeMenuOnSelect={false}
        defaultOptions
        loadOptions={loadRecursos}
        onChange={(select) => setSelectedRecursos(select)}
        value={selectedRecursos}
        required
      />
      {selectedRecursos?.length === 0 && (
        <p style={{ color: "red" }}>Seleccione al menos un recurso</p>
      )}
    </div>
  );
};

export default SelectRecursos;
