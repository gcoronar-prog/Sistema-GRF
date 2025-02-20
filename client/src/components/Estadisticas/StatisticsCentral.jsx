import React, { useEffect, useState } from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";
import { BlobProvider } from "@react-pdf/renderer";
import CentralStatsPDF from "../PDFs/CentralStatsPDF";

function StatisticsCentral() {
  const [central, setCentral] = useState([]);
  const [clasif, setClasif] = useState("");

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

  const handleClasificacion = (e) => {
    setClasif(e.target.value);
  };

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    console.log(name, value);
    setCentral({ ...central, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/estadisticaCentral", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(central),
      });
      if (!res.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }
      console.log(central);
    } catch (error) {
      console.error(error);
    }
  };

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
          />
          <label htmlFor="">Fecha de termino</label>
          <input
            type="datetime-local"
            name="fechaFin"
            id=""
            onChange={handleChanges}
          />
        </div>

        <div className="estadoInforme">
          <label htmlFor="atendido">Atendido</label>
          <input
            type="radio"
            name="estado_informe"
            id="atendido"
            value={"atendido"}
          />
          <label htmlFor="progreso">En progreso</label>
          <input
            type="radio"
            name="estado_informe"
            id="progreso"
            value={"progreso"}
          />
          <label htmlFor="pendiente">Pendiente</label>
          <input
            type="radio"
            name="estado_informe"
            id="pendiente"
            value={"pendiente"}
          />
        </div>

        <div className="clasiInforme">
          <label htmlFor="clasificacion">Clasificación</label>
          <select
            name="clasificacion_informe"
            id="clasificacion"
            onChange={handleClasificacion}
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
            name="captura_informe"
            id="radios"
            value={"radios"}
          />
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="radio"
            name="captura_informe"
            id="telefono"
            value={"telefono"}
          />
          <label htmlFor="rrss">RRSS</label>
          <input type="radio" name="captura_informe" id="rrss" value={"rrss"} />
          <label htmlFor="presencial">Presencial</label>
          <input
            type="radio"
            name="captura_informe"
            id="presencial"
            value={"presencial"}
          />
          <label htmlFor="email">E-mail</label>
          <input
            type="radio"
            name="captura_informe"
            id="email"
            value={"email"}
          />
        </div>

        <div className="origenInforme">
          <SelectOrigin />
        </div>

        <div className="recursosInforme">
          {/*select multiple de recursos con checkbox */}
        </div>

        <div className="sectorInforme">
          <label htmlFor="">Sector:</label>
          <SelectSector />
        </div>

        <div className="vechiculoInforme">
          <label htmlFor="">Vehículos:</label>
          <SelectVehiculo />
        </div>

        <div className="operadorInforme">
          {/*select con centralistas usar react-select */}
        </div>

        <div className="tipoReporte">
          <label htmlFor="">Tipo de informe:</label>
          <SelectTipo tipo={clasif} />
        </div>
        <div>
          <BlobProvider document={<CentralStatsPDF data={central} />}>
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
        <button type="submit">agregar</button>
      </form>
    </div>
  );
}

export default StatisticsCentral;
