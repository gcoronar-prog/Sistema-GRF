import React, { useState } from "react";

function StatisticsSGC() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoFilter, setEstadoFilter] = useState({
    Proceso: false,
    Seguimiento: false,
    Visitado: false,
    Atendido: false,
    Derivado: false,
    Desistido: false,
    Anulado: false,
  });
  return <div>StatisticsSGC</div>;
}

export default StatisticsSGC;
