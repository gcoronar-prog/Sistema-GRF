import React, { useEffect, useState } from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";
import SelectRecursos from "../SelectRecursos";
import { BlobProvider } from "@react-pdf/renderer";
import CentralStatsPDF from "../PDFs/CentralStatsPDF";
import dayjs from "dayjs";

function StatisticsCentral() {
  const startMonth = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const dateNow = dayjs().format("YYYY-MM-DDTHH:mm");

  const defaultValues = {
    fechaInicio: startMonth,
    fechaFin: dateNow,
    estado: "",
    clasificacion: "",
    captura: "",
    origen: "",
    recursos: "",
    sector: "",
    vehiculo: "",
    centralista: "",
    tipoReporte: "",
  };

  const [central, setCentral] = useState(defaultValues);
  const [filter, setFilter] = useState([]);
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState([]);
  const [selectedRecursos, setSelectedRecursos] = useState([]);
  const [clasif, setClasif] = useState("");
  const [checkEstado, setCheckEstado] = useState([]);

  const fetchData = async (filters) => {
    try {
      const res = await fetch("http://localhost:3000/estadisticaCentral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await res.json();
      setFilter(data);
      console.log("filtro", data);
    } catch (error) {
      console.error(error);
    }
  };

  /*useEffect(() => {
    const loadCentral = async () => {
      try {
        const res = await fetch("http://localhost:3000/estadisticaCentral");
        const data = await res.json();
        setCentral(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCentral();
  }, []);*/

  useEffect(() => {
    const formattedFechaI = dayjs(central.fechaInicio).format(
      "YYYY-MM-DDTHH:mm"
    );
    const formattedFechaF = dayjs(central.fechaFin).format("YYYY-MM-DDTHH:mm");

    const initialData = {
      ...defaultValues,
      fechaInicio: formattedFechaI,
      fechaFin: formattedFechaF,
      estado: { atendido: false, progreso: false, pendiente: false },
      captura: "",
      clasificacion: "",
    };

    fetchData(initialData);
  }, []);

  useEffect(() => {
    const formattedFechaI = dayjs(central.fechaInicio).format(
      "YYYY-MM-DDTHH:mm"
    );
    const formattedFechaF = dayjs(central.fechaFin).format("YYYY-MM-DDTHH:mm");

    const formattedData = {
      ...defaultValues,
      fechaInicio: formattedFechaI,
      fechaFin: formattedFechaF,
      estado: Object.keys(central.estado)
        .filter((key) => central.estado[key])
        .join(","),
      captura: central.captura,
      clasificacion: central.clasificacion,
      origen: selectedOrigen,
      sector: selectedSector,
      vehiculo: JSON.stringify(selectedVehiculo),
      tipoReporte: selectedTipo,
      recursos: JSON.stringify(selectedRecursos),
    };
    console.log("recursos", selectedRecursos);
    fetchData(formattedData);
  }, [
    central,
    selectedOrigen,
    selectedSector,
    selectedVehiculo,
    selectedTipo,
    selectedRecursos,
  ]);

  // Manejar cambios en los inputs
  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;

    if (name === "estado") {
      setCentral((prev) => ({
        ...prev,
        estado: {
          ...prev.estado,
          [value]: checked,
        },
      }));
    } else {
      setCentral((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    console.log(name, value, checked, type);
  };

  // Manejar cambios en la clasificación
  const handleClasificacion = (e) => {
    const { name, value } = e.target;
    setClasif(value);
    setCentral((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="rangoFecha">
        <label htmlFor="">Fecha de inicio</label>
        <input
          type="datetime-local"
          name="fechaInicio"
          id=""
          onChange={handleChanges}
          value={central.fechaInicio}
        />
        <label htmlFor="">Fecha de termino</label>
        <input
          type="datetime-local"
          name="fechaFin"
          id=""
          onChange={handleChanges}
          value={central.fechaFin}
        />
      </div>

      <div className="estadoInforme">
        <label htmlFor="estado">Estados</label>

        <label htmlFor="">Atendido</label>
        <input
          type="checkbox"
          name="estado"
          value="atendido"
          id=""
          onChange={handleChanges}
          checked={central.estado.atendido}
        />
        <label htmlFor="">En progreso</label>
        <input
          type="checkbox"
          name="estado"
          id=""
          value="progreso"
          onChange={handleChanges}
          checked={central.estado.progreso}
        />
        <label htmlFor="">Pendiente</label>
        <input
          type="checkbox"
          name="estado"
          id=""
          value="pendiente"
          onChange={handleChanges}
          checked={central.estado.pendiente}
        />
      </div>

      <div className="clasiInforme">
        <label htmlFor="clasificacion">Clasificación</label>
        <select
          name="clasificacion"
          id="clasificacion"
          onChange={handleClasificacion}
          value={central.clasificacion}
        >
          <option value="">Seleccione informe</option>
          <option value="Emergencia">Emergencia</option>
          <option value="Incidente">Incidente</option>
          <option value="Factor de riesgo">Factor de riesgo</option>
          <option value="Novedad">Novedad</option>
        </select>
      </div>

      <div className="capturaInforme">
        <label htmlFor="radios">Radio</label>
        <input
          type="radio"
          name="captura"
          id="radios"
          value={"radios"}
          onChange={handleChanges}
          checked={central.captura === "radios"}
        />
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="radio"
          name="captura"
          id="telefono"
          value={"telefono"}
          onChange={handleChanges}
          checked={central.captura === "telefono"}
        />
        <label htmlFor="rrss">RRSS</label>
        <input
          type="radio"
          name="captura"
          id="rrss"
          value={"rrss"}
          onChange={handleChanges}
          checked={central.captura === "rrss"}
        />
        <label htmlFor="presencial">Presencial</label>
        <input
          type="radio"
          name="captura"
          id="presencial"
          value={"presencial"}
          onChange={handleChanges}
          checked={central.captura === "presencial"}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="radio"
          name="captura"
          id="email"
          value={"email"}
          onChange={handleChanges}
          checked={central.captura === "email"}
        />
      </div>

      <div className="origenInforme">
        <label htmlFor="">Origen:</label>
        <SelectOrigin
          selectedOrigin={selectedOrigen}
          setSelectedOrigin={setSelectedOrigen}
        />
      </div>

      <div className="recursosInforme">
        {/*select multiple de recursos con checkbox */}
      </div>

      <div className="sectorInforme">
        <label htmlFor="">Sector:</label>
        <SelectSector
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
        />
      </div>

      <div className="vechiculoInforme">
        <label htmlFor="">Vehículos:</label>
        <SelectVehiculo
          selectedVehiculo={selectedVehiculo}
          setSelectedVehiculo={setSelectedVehiculo}
        />
      </div>

      <div className="operadorInforme">
        {/*select con centralistas usar react-select */}
      </div>

      <div className="tipoReporte">
        <label htmlFor="">Tipo de informe:</label>
        <SelectTipo
          tipo={clasif}
          selectedTipo={selectedTipo}
          setSelectedTipo={setSelectedTipo}
        />
      </div>

      <div className="recursosInvolucrados">
        <label htmlFor="">Recursos</label>
        <SelectRecursos
          selectedRecursos={selectedRecursos}
          setSelectedRecursos={setSelectedRecursos}
        />
      </div>
      <div>
        <BlobProvider document={<CentralStatsPDF data={filter} />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando documento</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Generar PDF
              </button>
            )
          }
        </BlobProvider>
      </div>
      <button>agregar</button>
    </div>
  );
}

export default StatisticsCentral;
