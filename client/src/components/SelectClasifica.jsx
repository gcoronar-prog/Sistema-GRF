import { useState } from "react";
import Select from "react-select";

const options = [
  {
    value: 0,
    label: "Seleccione opción",
  },
  { value: 1, label: "Emergencia" },
  { value: 2, label: "Incidente" },
  { value: 3, label: "Factor de riesgo" },
  { value: 4, label: "Novedad" },
];
const SelectClasifica = ({ selectedClasif, setSelectedClasif, edition }) => {
  //const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div style={{ width: "30%" }}>
      <Select
        options={options}
        value={selectedClasif}
        onChange={(selectedOption) => setSelectedClasif(selectedOption)}
        isClearable
        isDisabled={edition}
      />
    </div>
  );
};

export default SelectClasifica;
