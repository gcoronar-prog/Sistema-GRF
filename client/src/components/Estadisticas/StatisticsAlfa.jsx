import React from "react";
import { useState } from "react";

function StatisticsAlfa() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [fechaInicioDoc, setFechaInicioDoc] = useState("");
  const [fechaFinDoc, setFechaFinDoc] = useState("");
  const [montoInicio, setMontoInicio] = useState("");
  const [montoFin, setMontoFin] = useState("");
  const [escala, setEscala] = useState("");
  const [tipoEventos, setTipoEventos] = useState([]);

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
    console.log(name, value);
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

    if (tipoEventos.length) {
      tipoEventos.forEach((evento) => params.append("tipoEventos", evento));
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
        "Incendio forestal",
        "Incendio urbano",
        "Sust. peligrosas",
        "Accidente Mult. Víctimas",
        "Corte Energía eléctrica",
        "Corte agua potable",
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

      <div>
        <button onClick={fetchData}>ver info</button>
      </div>
    </>
  );
}

export default StatisticsAlfa;
