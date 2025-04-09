import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListPendiente(refresh) {
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState([]);
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    loadPendiente();
  }, [refresh, estado]);

  const loadPendiente = async () => {
    try {
      const url =
        estado === 1
          ? "http://localhost:3000/informes/pendientes"
          : "http://localhost:3000/informes/progreso";

      const res = await fetch(url);
      const data = await res.json();
      setPendientes(data.informe);
      console.log(data);
    } catch (error) {
      console.error("Error al cargar los pendientes:", error);
    }
  };

  const moveToPendiente = (id) => {
    navigate(`/informes/central/${id}`);
    //console.log(id);
  };

  return (
    <>
      <div className="card">
        <div className="card-header text-center">
          <p className="h5">
            Listado informes {estado === 1 ? "pendientes" : "en progreso"}
          </p>
        </div>
        <div className="card-body">
          <div className="text-center">
            <div className="btn-group mb-2">
              <button
                className="btn btn-outline-success"
                onClick={() => setEstado(1)}
              >
                Pendiente
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setEstado(2)}
              >
                Progreso
              </button>
            </div>
          </div>
          <div style={{ maxWidth: "600px", margin: "auto" }}>
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead className="table-success text-center">
                <tr>
                  <th>Código Informe</th>
                  <th>Fecha Informe</th>

                  <th>Clasificación</th>

                  <th>Origen</th>
                  <th>Persona Informante</th>
                </tr>
              </thead>
              <tbody className="table-group-divider text-center">
                {pendientes.map((p) => (
                  <tr
                    key={p.id_informes_central}
                    style={{ cursor: "pointer" }}
                    onClick={() => moveToPendiente(p.id_informes_central)}
                  >
                    <td>{p.cod_informes_central}</td>
                    <td>{new Date(p.fecha_informe).toLocaleString()}</td>

                    <td>{p.clasificacion_informe.label}</td>

                    <td>{p.origen_informe.label}</td>
                    <td>{p.persona_informante.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListPendiente;
