import React, { useEffect, useState } from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";
import SelectRecursos from "../SelectRecursos";
import { BlobProvider } from "@react-pdf/renderer";
import CentralStatsPDF from "../PDFs/CentralStatsPDF";
import dayjs from "dayjs";
import EstadoCentralPDF from "../PDFs/EstadoCentralPDF";
import OrigenCentralPDF from "../PDFs/OrigenCentralPDF";
import ClasifCentralPDF from "../PDFs/ClasifCentralPDF";
import RecursosCentralPDF from "../PDFs/RecursosCentralPDF";
import RangoCentralPDF from "../PDFs/RangoCentralPDF";
import SelectClasifica from "../SelectClasifica";

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
  const [selectedClasif, setSelectedClasif] = useState([]);
  const [clasif, setClasif] = useState("");
  const [clasifFilter, setClasifFilter] = useState(defaultValues);
  const [origenFilter, setOrigenFilter] = useState(defaultValues);
  const [estadoFilter, setEstadoFilter] = useState(defaultValues);
  const [recursosFilter, setRecursosFilter] = useState(defaultValues);
  const [rangoFilter, setRangoFilter] = useState(defaultValues);

  useEffect(() => {
    const fetchInitialData = async () => {
      const formattedFechaI = dayjs(central.fechaInicio).format(
        "YYYY-MM-DDTHH:mm"
      );
      const formattedFechaF = dayjs(central.fechaFin).format(
        "YYYY-MM-DDTHH:mm"
      );

      const initialData = {
        ...defaultValues,
        fechaInicio: formattedFechaI,
        fechaFin: formattedFechaF,
        estado: { atendido: false, progreso: false, pendiente: false },
        captura: {
          radios: false,
          telefono: false,
          rrss: false,
          presencial: false,
          email: false,
        },
        clasificacion: "",
      };

      try {
        const [data1, data2, data3, data4, data5, data6] = await Promise.all([
          fetch("http://localhost:3000/estadisticaCentral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_clasif_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_origen_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_estado_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_recursos_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_rango_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
          }).then((res) => res.json()),
        ]);

        setFilter(data1);
        setClasifFilter(data2);
        setOrigenFilter(data3);
        setEstadoFilter(data4);
        setRecursosFilter(data5);
        setRangoFilter(data6);
      } catch (error) {
        console.error(error);
      }
      fetchInitialData();
    };
  }, []);

  /*useEffect(() => {
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
      captura: Object.keys(central.captura)
        .filter((key) => central.captura[key])
        .join(","),
      clasificacion: central.clasificacion,
      origen: selectedOrigen,
      sector: selectedSector,
      vehiculo: JSON.stringify(selectedVehiculo),
      tipoReporte: selectedTipo,
      recursos: JSON.stringify(selectedRecursos),
    };

    //console.log("recursos", central.captura);
    fetchData(formattedData);
    resumenClasif(formattedData);
    resumenOrigen(formattedData);
    resumenEstado(formattedData);
    resumenRecursos(formattedData);
    resumenRango(formattedData);
    //console.log("fecha", formattedFechas);
  }, [
    central,
    selectedOrigen,
    selectedSector,
    selectedVehiculo,
    selectedTipo,
    selectedRecursos,
  ]);*/

  useEffect(() => {
    const fetchAllData = async () => {
      const formattedFechaI = dayjs(central.fechaInicio).format(
        "YYYY-MM-DDTHH:mm"
      );
      const formattedFechaF = dayjs(central.fechaFin).format(
        "YYYY-MM-DDTHH:mm"
      );

      const formattedData = {
        ...defaultValues,
        fechaInicio: formattedFechaI,
        fechaFin: formattedFechaF,
        estado: Object.keys(central.estado)
          .filter((key) => central.estado[key])
          .join(","),
        captura: Object.keys(central.captura)
          .filter((key) => central.captura[key])
          .join(","),
        clasificacion: selectedClasif,
        origen: selectedOrigen,
        sector: selectedSector,
        vehiculo: JSON.stringify(selectedVehiculo),
        tipoReporte: selectedTipo,
        recursos: JSON.stringify(selectedRecursos),
      };

      try {
        const [data1, data2, data3, data4, data5, data6] = await Promise.all([
          fetch("http://localhost:3000/estadisticaCentral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_clasif_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_origen_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_estado_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_recursos_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
          fetch("http://localhost:3000/resumen_rango_central", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }).then((res) => res.json()),
        ]);

        setFilter(data1);
        setClasifFilter(data2);
        setOrigenFilter(data3);
        setEstadoFilter(data4);
        setRecursosFilter(data5);
        setRangoFilter(data6);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllData();
  }, [
    central,
    selectedClasif,
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
    } else if (name === "captura") {
      setCentral((prev) => ({
        ...prev,
        captura: {
          ...prev.captura,
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
        <SelectClasifica
          selectedClasif={selectedClasif}
          setSelectedClasif={setSelectedClasif}
        />
      </div>

      <div className="capturaInforme">
        <label htmlFor="radios">Radio</label>
        <input
          type="checkbox"
          name="captura"
          id="radios"
          value={"radios"}
          onChange={handleChanges}
          checked={central.captura.radios}
        />
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="checkbox"
          name="captura"
          id="telefono"
          value={"telefono"}
          onChange={handleChanges}
          checked={central.captura.telefono}
        />
        <label htmlFor="rrss">RRSS</label>
        <input
          type="checkbox"
          name="captura"
          id="rrss"
          value={"rrss"}
          onChange={handleChanges}
          checked={central.captura.rrss}
        />
        <label htmlFor="presencial">Presencial</label>
        <input
          type="checkbox"
          name="captura"
          id="presencial"
          value={"presencial"}
          onChange={handleChanges}
          checked={central.captura.presencial}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="checkbox"
          name="captura"
          id="email"
          value={"email"}
          onChange={handleChanges}
          checked={central.captura.email}
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
          tipo={selectedClasif}
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
      <div>
        <BlobProvider document={<ClasifCentralPDF data={clasifFilter} />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando documento</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Resumen por Clasificación
              </button>
            )
          }
        </BlobProvider>
      </div>

      <div>
        <BlobProvider document={<OrigenCentralPDF data={origenFilter} />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando documento</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Resumen por Origen
              </button>
            )
          }
        </BlobProvider>
      </div>

      <div>
        <BlobProvider document={<EstadoCentralPDF data={estadoFilter} />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando documento</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Resumen por Estado
              </button>
            )
          }
        </BlobProvider>
      </div>

      <div>
        <BlobProvider document={<RecursosCentralPDF data={recursosFilter} />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando documento</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Resumen Recursos involucrados
              </button>
            )
          }
        </BlobProvider>
      </div>
      <div>
        <BlobProvider document={<RangoCentralPDF data={rangoFilter} />}>
          {({ url, loading }) =>
            loading ? (
              <button>Cargando documento</button>
            ) : (
              <button onClick={() => window.open(url, "_blank")}>
                Resumen Rango Horario
              </button>
            )
          }
        </BlobProvider>
      </div>
    </div>
  );
}

export default StatisticsCentral;
