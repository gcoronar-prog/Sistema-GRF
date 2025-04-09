import AsyncSelect from "react-select/async";
import React from "react";

const SelectRecursos = ({ selectedRecursos, setSelectedRecursos, edition }) => {
  const loadRecursos = async () => {
    const res = await fetch("http://localhost:3000/recursos");
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
      />
    </div>
  );
};

export default SelectRecursos;
