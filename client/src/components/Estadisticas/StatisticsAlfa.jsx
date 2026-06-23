import React from "react";
import { useState } from "react";

function StatisticsAlfa() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [fechaInicioDoc, setFechaInicioDoc] = useState("");
  const [fechaFinDoc, setFechaFinDoc] = useState("");
  const [montoInicio, setMontoInicio] = useState("");
  const [montoFin, setMontoFin] = useState("");
  const [escala, setEscala] = useState("");
  const [tipoEventos, setTipoEventos] = useState("");
  const [evaDanios, setEvaDanios] = useState([]);
  const [nivEmergencia, setNivEmergencia] = useState("");
  const [danioPersonas, setDanioPersonas] = useState([]);
  const [evalNecesidad, setEvalNecesidad] = useState([]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFechaInicioDoc((prev) => (name === "fechaInicioDoc" ? value : prev));
    setFechaFinDoc((prev) => (name === "fechaFinDoc" ? value : prev));
    setMontoInicio((prev) => (name === "montoInicio" ? value : prev));
    setMontoFin((prev) => (name === "montoFin" ? value : prev));
    setEscala((prev) => (name === "escala" ? value : prev));
    setTipoEventos((prev) =>
      name === "tipoEventos"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setEvaDanios((prev) =>
      name === "evaDanios"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setNivEmergencia((prev) =>
      name === "nivEmergencia"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setDanioPersonas((prev) =>
      name === "danioPersonas"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
    setEvalNecesidad((prev) =>
      name === "evalNecesidad"
        ? prev.includes(value)
          ? prev.filter((e) => e !== value)
          : [...prev, value]
        : prev,
    );
  };

  const fetchData = async () => {
    let url = `${server_back}/estadisticaAlfa?`;
    let params = new URLSearchParams();

    if (fechaInicioDoc && fechaFinDoc) {
      params.append("fechaInicioDoc", fechaInicioDoc);
      params.append("fechaFinDoc", fechaFinDoc);
    }

    if (montoInicio && montoFin) {
      params.append("montoInicio", montoInicio);
      params.append("montoFin", montoFin);
    }

    if (escala) {
      params.append("escala", escala);
    }

    if (tipoEventos) {
      tipoEventos.forEach((evento) => params.append("tipoEventos", evento));
    }

    if (evaDanios) {
      evaDanios.forEach((danio) => params.append("evaDanios", danio));
    }

    if (nivEmergencia) {
      params.append("nivEmergencia", nivEmergencia);
    }

    if (danioPersonas) {
      params.append("danioPersonas", danioPersonas);
    }

    if (evalNecesidad) {
      params.append("evalNecesidad", evalNecesidad);
    }

    try {
      const response = await fetch(url + params.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <div>
        <label htmlFor="">fecha doc inicio</label>
        <input
          type="datetime-local"
          name="fechaInicioDoc"
          id="fechaInicioDoc"
          value={fechaInicioDoc}
          onChange={handleChanges}
        />
        <label htmlFor="">fecha doc fin</label>
        <input
          type="datetime-local"
          name="fechaFinDoc"
          id="fechaFinDoc"
          value={fechaFinDoc}
          onChange={handleChanges}
        />

        <label htmlFor="">Monto estimado en daños</label>
        <label htmlFor="">Desde:</label>
        <input
          type="text"
          name="montoInicio"
          id="montoInicio"
          value={montoInicio}
          onChange={handleChanges}
        />
        <label htmlFor="">Hasta:</label>
        <input
          type="text"
          name="montoFin"
          id="montoFin"
          value={montoFin}
          onChange={handleChanges}
        />
        {console.log(fechaInicioDoc, fechaFinDoc)}
      </div>
      <label htmlFor="">Escala sismo</label>
      <select name="escala" id="escala" value={escala} onChange={handleChanges}>
        <option value="">Seleccione escala de sismo</option>
        {[
          "I",
          "II",
          "III",
          "IV",
          "V",
          "VI",
          "VII",
          "VIII",
          "IX",
          "X",
          "XI",
          "XII",
        ].map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      {[
        "Inundación",
        "Temporal",
        "Deslizamiento",
        "Act. Volcánica",
        "Inc. forestal",
        "Inc. urbano",
        "Sust. peligrosas",
        "Acc. Mult. Víctimas",
        "Corte Energía",
        "Corte agua",
        "Otro",
      ].map((e) => (
        <>
          <div key={e} style={{ display: "flex", alignItems: "center" }}>
            <input
              key={e}
              type="checkbox"
              name="tipoEventos"
              id={e}
              onChange={handleChanges}
              value={e}
            />
            <label htmlFor={e}>{e}</label>
          </div>
        </>
      ))}

      <h5>Daños vivienda</h5>
      {[
        "Daño menor habitable",
        "Daño mayor no habitable",
        "Destuidas, irrecuperables",
        "No evaluadas",
      ].map((e) => (
        <>
          <div key={e} style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              key={e}
              name="evaDanios"
              id={e}
              onChange={handleChanges}
              value={e}
            />
            <label htmlFor={e}>{e}</label>
          </div>
        </>
      ))}

      <div>
        <h5>Niveles de emergencia</h5>
        {["Emergencia Menor", "Emergencia Mayor", "Desastre", "Catástrofe"].map(
          (e, index) => (
            <>
              <div key={e} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  key={e}
                  name="nivEmergencia"
                  id={e}
                  onChange={handleChanges}
                  value={index + 1}
                />
                <label htmlFor={e}>{e}</label>
              </div>
            </>
          ),
        )}
      </div>
      <div>
        <h5>Daños personas</h5>
        {[
          "Afectadas",
          "Damnificadas",
          "Heridas",
          "Muertas",
          "Desaparecidas",
          "Albergados",
        ].map((e) => (
          <>
            <div key={e} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                key={e}
                name="danioPersonas"
                id={e}
                onChange={handleChanges}
                value={e}
              />
              <label htmlFor={e}>{e}</label>
            </div>
          </>
        ))}
      </div>
      <div>
        <div>
          <h5>Evaluación de necesidades</h5>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              name="evalNecesidad"
              id="evalNecesidad"
              onChange={handleChanges}
              value={"Se requiere"}
            />
            <label htmlFor="evalNecesidad">Se requiere</label>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              name="evalNecesidad"
              id="evalNoNecesidad"
              onChange={handleChanges}
              value={"No se requiere"}
            />
            <label htmlFor="evalNoNecesidad">No se requiere</label>
          </div>
        </div>
        <button onClick={fetchData}>ver info</button>
      </div>
    </>
  );
}

export default StatisticsAlfa;
