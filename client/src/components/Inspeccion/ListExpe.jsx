import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListExpe() {
  const [expeEstado, setExpeEstado] = useState([]);
  const [expeTipo, setExpeTipo] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("Pendiente");
  const [selectedTipo, setSelectedTipo] = useState("");

  const server = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  useEffect(() => {
    loadExped();
  }, [selectedEstado, selectedTipo]);

  const loadExped = async () => {
    try {
      let estado = `${server}/exped_estado?estado=${selectedEstado}`;
      let tipo = `${server}/exped_tipo?tipo=${selectedTipo}`;

      if (selectedEstado) {
        const res = await fetch(estado, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setExpeEstado(data.expediente);
      }

      if (selectedTipo) {
        const res = await fetch(tipo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setExpeTipo(data.expediente);
      }

      console.log("expediente", tipo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSelect = async (e) => {
    const { value } = e.target;
    setSelectedEstado(value);
    setSelectedTipo("");
    console.log(selectedEstado);
  };
  const handleChangeSelectTipo = async (e) => {
    const { value } = e.target;
    setSelectedTipo(value);
    setSelectedEstado("");
    console.log(selectedTipo);
  };

  const handleNavigateExpe = (id) => {
    navigate(`/inspect/${id}/edit`);
    //console.log(id);
  };

  return (
    <>
      <div className="card shadow-sm mb-4">
        <div className="card-header text-center text-bg-light">
          <h5 className="mb-0">
            <i className="bi bi-folder2-open me-2"></i>
            Listado Expedientes
          </h5>
        </div>

        <div className="card-body">
          <div className="row justify-content-center g-4">
            <div className="col-md-5">
              <label htmlFor="selectEstado" className="form-label fw-bold">
                Estado expedientes
              </label>
              <select
                name="selectEstado"
                id="selectEstado"
                className="form-select"
                onChange={handleChangeSelect}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Resuelto">Resuelto</option>
                <option value="Despachado">Despachado</option>
                <option value="Nulo">Nulo</option>
              </select>
            </div>
            <div className="col-md-5">
              <label htmlFor="selectEstado" className="form-label fw-bold">
                Tipo expedientes
              </label>
              <select
                name="selectTipo"
                id="selectTipo"
                className="form-select"
                onChange={handleChangeSelectTipo}
              >
                <option value="Notificación">Notificación</option>
                <option value="Citación">Citación</option>
                <option value="Causas">Causas</option>
                <option value="Solicitudes">Solicitudes</option>
              </select>
            </div>
          </div>
          <hr />
          <p className="fst-italic text-center text-muted mt-2">
            Expedientes por: {selectedEstado || selectedTipo}
          </p>
          <div className="table-responsive mt-4">
            <table className="table table-bordered table-hover align-middle text-center table-sm">
              <thead className="table-success">
                <tr>
                  <th>Código expediente</th>
                  <th>Fecha expediente</th>

                  <th>Tipo de procedimiento</th>

                  <th>Estado</th>
                  <th>Inspector</th>
                  <th>Sector</th>
                  <th style={{ width: "80px" }}></th>
                </tr>
              </thead>

              <tbody className="table-group-divider">
                {(selectedEstado ? expeEstado : selectedTipo ? expeTipo : [])
                  .length > 0 ? (
                  (selectedEstado ? expeEstado : expeTipo).map((e) => (
                    <tr key={e.id_expediente}>
                      <td>{e.id_expediente}</td>
                      <td>{new Date(e.fecha_documento).toLocaleString()}</td>
                      <td>{e.tipo_procedimiento}</td>
                      <td>{e.estado_exp}</td>
                      <td>{e.funcionario}</td>
                      <td>{e.sector_infraccion}</td>
                      <td>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleNavigateExpe(e.id_expediente)}
                        >
                          <i className="bi bi-box-arrow-in-right"></i> Ir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No existen expedientes para el filtro seleccionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListExpe;
