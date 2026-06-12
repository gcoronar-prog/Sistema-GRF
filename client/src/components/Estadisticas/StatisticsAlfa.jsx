import React from "react";
import { useState } from "react";

function StatisticsAlfa() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [fecha_inicio_doc, setFecha_inicio_doc] = useState("");
  const [fecha_fin_doc, setFecha_fin_doc] = useState("");

  const fetchData = async () => {
    let url = `${server_back}/estadisticaAlfa?`;
    let params = new URLSearchParams();

    if (fechaInicioDoc && fechaFinDoc) {
      params.append("fecha_ocurrencia", fechaInicioDoc);
      params.append("fecha_ocurrencia", fechaFinDoc);
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
    <div>
      <label htmlFor="">fecha doc inicio</label>
      <input
        type="datetime-local"
        name="fecha_inicio_doc"
        id="fecha_inicio_doc"
        value={fecha_inicio_doc}
        onChange={(e) => setFecha_inicio_doc(e.target.value)}
      />
      <label htmlFor="">fecha doc fin</label>
      <input
        type="datetime-local"
        value={fecha_fin_doc}
        onChange={(e) => setFecha_fin_doc(e.target.value)}
      />

      <button onClick={fetchData}>ver info</button>
    </div>
  );
}

export default StatisticsAlfa;
