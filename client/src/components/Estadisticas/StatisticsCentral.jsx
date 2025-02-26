import React, { useEffect, useState } from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";
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
  const [clasif, setClasif] = useState("");
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState([]);
  const [urlPdf, setUrlPdf] = useState(null);
  const [generatePDF, setGeneratePDF] = useState(false);

  const loadCentral = async () => {
    try {
      const res = await fetch("http://localhost:3000/estadisticaCentral");
      const data = await res.json();
      setCentral(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadCentral();
  }, []);

  useEffect(() => {
    if (urlPdf && generatePDF) {
      //window.open(urlPdf, "_blank");
      console.log("URL:", urlPdf);
      console.log("FILTRO EN URL:");
      setGeneratePDF(false);
    }
  }, [urlPdf, generatePDF]);

  const handleClasificacion = (e) => {
    const { name, value } = e.target;
    setClasif(value);
    //console.log(name, value);
    setCentral({ ...central, [name]: value });
  };

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    console.log(name, value);
    setCentral((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratePDF(true);
    const formattedFechaI = dayjs(central.fechaInicio).format(
      "YYYY-MM-DDTHH:mm"
    );
    const formattedFechaF = dayjs(central.fechaFin).format("YYYY-MM-DDTHH:mm");
    const formattedOrigen = selectedOrigen;
    const formattedSector = selectedSector;
    const formattedVehiculo = selectedVehiculo;
    const formattedTipo = selectedTipo;

    const formattedData = {
      ...central,
      fechaInicio: formattedFechaI,
      fechaFin: formattedFechaF,
      origen: formattedOrigen,
      sector: formattedSector,
      vehiculo: formattedVehiculo,
      tipo: formattedTipo,
    };
    console.log("origen", formattedData.origen);
    console.log("formateada", formattedData);
    try {
      const res = await fetch("http://localhost:3000/estadisticaCentral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
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

  /*const generatePDF = async (data) => {
    return new Promise((resolve) => {
      const blobProvider = (
        <BlobProvider document={<CentralStatsPDF data={data} />}>
          {({ url }) => {
            if (url) {
              resolve(url);
            }
          }}
        </BlobProvider>
      );

      render(blobProvider, document.createElement("div"));
    });
  };*/

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="atendido">Atendido</label>
          <input
            type="radio"
            name="estado"
            id="atendido"
            value={"atendido"}
            onChange={handleChanges}
            checked={central.estado === "atendido"}
          />
          <label htmlFor="progreso">En progreso</label>
          <input
            type="radio"
            name="estado"
            id="progreso"
            value={"progreso"}
            onChange={handleChanges}
            checked={central.estado === "progreso"}
          />
          <label htmlFor="pendiente">Pendiente</label>
          <input
            type="radio"
            name="estado"
            id="pendiente"
            value={"pendiente"}
            onChange={handleChanges}
            checked={central.estado === "pendiente"}
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
        <div>
          <BlobProvider document={<CentralStatsPDF data={filter} />}>
            {({ url, loading }) => {
              if (!loading && url && url !== urlPdf) {
                setUrlPdf(url);
              }

              return (
                <button type="submit" disabled={loading}>
                  {loading ? "Cargando documento" : "Generar PDF"}
                </button>
              );
            }}
          </BlobProvider>
        </div>
        <button type="submit">agregar</button>
      </form>
    </div>
  );
}

export default StatisticsCentral;
