import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListExpe() {
  const [expeEstado, setExpeEstado] = useState([]);
  const [expeTipo, setExpeTipo] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("Pendiente");
  const [selectedTipo, setSelectedTipo] = useState("");

  const server = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const navigate = useNavigate();
  useEffect(() => {
    loadExped();
  }, [selectedEstado, selectedTipo]);

  const loadExped = async () => {
    try {
      let estado = `${server}/exped_estado?estado=${selectedEstado}`;
      let tipo = `${server}/exped_tipo?tipo=${selectedTipo}`;

      if (selectedEstado) {
        const res = await fetch(estado);
        const data = await res.json();
        setExpeEstado(data.expediente);
      }

      if (selectedTipo) {
        const res = await fetch(tipo);
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
      <div className="card">
        <div className="card-header text-center text-bg-light">
          <p className="h5">Listado Expedientes</p>
        </div>
        <div className="card-body">
          <div className="row d-flex justify-content-center">
            <div className="col-md-5">
              <label htmlFor="selectEstado" className="fw-bold">
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
              <label htmlFor="selectEstado" className="fw-bold">
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
          <span className="fst-italic d-flex justify-content-center">
            Expedientes por: {selectedEstado || selectedTipo}
          </span>
          <div style={{ maxWidth: "700px", margin: "auto", marginTop: "30px" }}>
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead className="table-success text-center align-middle">
                <tr>
                  <th>Código expediente</th>
                  <th>Fecha expediente</th>

                  <th>Tipo de procedimiento</th>

                  <th>Estado</th>
                  <th>Inspector</th>
                  <th>Sector</th>
                  <th style={{ width: "100px" }}></th>
                </tr>
              </thead>

              <tbody className="table-group-divider text-center">
                {selectedEstado ? (
                  expeEstado.map((e) => (
                    <tr key={e.id_expediente}>
                      <td>{e.id_expediente}</td>
                      <td>{new Date(e.fecha_documento).toLocaleString()}</td>

                      <td>{e.tipo_procedimiento}</td>

                      <td>{e.estado_exp}</td>
                      <td>{e.funcionario}</td>
                      <td>{e.sector_infraccion}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleNavigateExpe(e.id_expediente)}
                        >
                          IR <i className="bi bi-box-arrow-in-right"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : selectedTipo ? (
                  expeTipo.map((e) => (
                    <tr key={e.id_expediente}>
                      <td>{e.id_expediente}</td>
                      <td>{new Date(e.fecha_documento).toLocaleString()}</td>

                      <td>{e.tipo_procedimiento}</td>

                      <td>{e.estado_exp}</td>
                      <td>{e.funcionario}</td>
                      <td>{e.sector_infraccion}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleNavigateExpe(e.id_expediente)}
                        >
                          IR
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <strong>No existen expedientes</strong>
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
