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
        ref={selectRef}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: !selectedClasif ? "red" : base.borderColor,
          }),
        }}
      />
      {!selectedClasif && (
        <p style={{ color: "red" }}>Seleccione clasificación de informe</p>
      )}
      {selectedClasif && null}
    </div>
  );
};

export default SelectClasifica;
