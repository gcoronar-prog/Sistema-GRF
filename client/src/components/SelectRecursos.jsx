import AsyncSelect from "react-select/async";
import React from "react";

const SelectRecursos = ({
  selectedRecursos,
  setSelectedRecursos,
  edition,

  selectRef,
}) => {
  const loadRecursos = async (inputValue) => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    const res = await fetch(`${servidor}/recursos`);
    const data = await res.json();

    return data
      .filter((item) =>
        item.recursos.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((item) => ({
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
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: !selectedRecursos ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedRecursos && (
        <p style={{ color: "red" }}>Seleccione recursos involucrados</p>
      )}
      {selectedRecursos && null}
    </div>
  );
};

export default SelectRecursos;
