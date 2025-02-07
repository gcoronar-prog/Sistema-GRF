import React, { useEffect, useState } from "react";

function ListPendiente() {
  const [pendientes, setPendientes] = useState([]);

  useEffect(() => {
    loadPendiente();
  }, []);

  const loadPendiente = async () => {
    try {
      const res = await fetch("http://localhost:3000/informes/pendientes");
      const data = await res.json(); // Obtén los datos de la API
      setPendientes(data.pendientes); // Accede a la propiedad "pendientes"
    } catch (error) {
      console.error("Error al cargar los pendientes:", error);
    }
  };

  const moveToPendiente = (id) => {
    console.log(id);
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
