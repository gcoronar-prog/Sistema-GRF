import Select from "react-select";
import React from "react";

const SelectRecursos = ({ selectedRecursos, setSelectedRecursos }) => {
  const recursos = [
    {
      value: `preventivo`,
      label: `Patrullaje preventivo`,
    },
  ];

  return (
    <div style={{ width: "30%" }}>
      <Select
        isMulti
        defaultOptions
        options={recursos}
        value={selectedRecursos}
        onChange={(select) => setSelectedRecursos(select)}
      />
    </div>
  );
};

export default SelectRecursos;
