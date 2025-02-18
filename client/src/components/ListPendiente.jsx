import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListPendiente(refresh) {
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState([]);

  useEffect(() => {
    loadPendiente();
  }, [refresh]);

  const loadPendiente = async () => {
    try {
      const res = await fetch("http://localhost:3000/informes/pendientes");
      const data = await res.json();
      setPendientes(data.pendientes);
    } catch (error) {
      console.error("Error al cargar los pendientes:", error);
    }
  };

  const moveToPendiente = (id) => {
    navigate(`/informes/central/${id}`);
    //console.log(id);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID Informe</th>
            <th>Código Informe</th>
            <th>Fecha Informe</th>
            <th>Captura</th>
            <th>Clasificación</th>
            <th>Estado</th>
            <th>Origen</th>
            <th>Persona Informante</th>
          </tr>
        </thead>
        <tbody>
          {pendientes.map((p) => (
            <tr
              key={p.id_informes_central}
              style={{ cursor: "pointer" }}
              onClick={() => moveToPendiente(p.id_informes_central)}
            >
              <td>{p.id_informes_central}</td>
              <td>{p.cod_informes_central}</td>
              <td>{new Date(p.fecha_informe).toLocaleString()}</td>
              <td>{p.captura_informe}</td>
              <td>{p.clasificacion_informe}</td>
              <td>{p.estado_informe}</td>
              <td>{p.origen_informe.label}</td>
              <td>{p.persona_informante.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPendiente;
