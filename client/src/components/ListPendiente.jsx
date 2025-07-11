import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTokenSession } from "./useTokenSession";

function ListPendiente(refresh) {
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState([]);
  const [estado, setEstado] = useState(1);
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");
  const userData = useTokenSession();

  useEffect(() => {
    loadPendiente();
  }, [refresh, estado]);

  const loadPendiente = async () => {
    try {
      let url;

      switch (estado) {
        case 1:
          url = `${servidor}/informes/pendientes`;
          break;
        case 2:
          url = `${servidor}/informes/progreso`;
          break;
        case 3:
          url = `${servidor}/informes/emergencia`;
        default:
          break;
      }
      /* estado === 1
        ? `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informes/pendientes`
        : `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informes/progreso`;*/

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPendientes(data.informe);
      console.log(data);
    } catch (error) {
      console.error("Error al cargar los pendientes:", error);
    }
  };

  const moveToPendiente = (id) => {
    navigate(`/informes/central/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    //console.log(id);
  };

  const estados = { 1: "pendientes", 2: "en progreso", 3: " - Emergencias -" };
  return (
    <>
      <div className="card shadow-sm mb-4">
        <div className="card-header text-center text-bg-light">
          <h5 className="mb-0">
            <i className="bi bi-journal-text me-2"></i>
            Listado informes{" "}
            <span className="text-success">{estados[estado]}</span>
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-center mb-3 gap-2 flex-wrap">
            <div className="btn-group mb-2">
              <button
                className={`btn ${
                  estado === 1 ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setEstado(1)}
              >
                <i className="bi bi-hourglass-split me-1"></i> Pendiente
              </button>
              <button
                className={`btn ${
                  estado === 2 ? "btn-secondary" : "btn-outline-secondary"
                }`}
                onClick={() => setEstado(2)}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Progreso
              </button>
              <button
                className={`btn ${
                  estado === 3 ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => setEstado(3)}
              >
                <i className="bi bi-exclamation-circle me-1"></i> Emergencias
              </button>
            </div>
          </div>

          <div className="table responsive">
            <table className="table table-bordered table-hover align-middle text-center table-sm">
              <thead className="table-success">
                <tr>
                  <th>Código Informe</th>
                  <th>Fecha Informe</th>

                  <th>Clasificación</th>

                  <th>Origen</th>
                  <th>Persona Informante</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
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
