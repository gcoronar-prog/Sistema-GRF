import Select from "react-select";

const options = [
  { value: 1, label: "Emergencia" },
  { value: 2, label: "Incidente" },
  { value: 3, label: "Factor de riesgo" },
  { value: 4, label: "Novedad" },
];
const SelectClasifica = ({
  selectedClasif,
  setSelectedClasif,
  edition,
  error,
  selectRef,
}) => {
  //const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div>
      <Select
        options={options}
        value={selectedClasif}
        onChange={(selectedOption) => setSelectedClasif(selectedOption)}
        isDisabled={edition}
        isClearable
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
};

export default SelectClasifica;
