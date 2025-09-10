import React, { useState } from "react";
import ListSearchExpe from "./ListSearchExpe";
import ListDespacho from "./ListDespacho";

function DespachoExp() {
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

  const [busqueda, setBusqueda] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    jpl: "",
  });
  const [expediente, setExpediente] = useState([]);
  const [digitador, setDigitador] = useState([]);

  const buscaExpediente = async (fecha_inicio, fecha_fin, jpl) => {
    try {
      const res = await fetch(
        `${servidor_local}/search_expediente?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&jpl=${jpl}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      console.log(data, "expediente busqueda");

      // Guardar en el estado
      setExpediente(data.expedientes || []);
    } catch (error) {
      console.error(error);
    }
  };

  const selectDigitador = async () => {
    try {
      const res = await fetch(`${servidor_local}/digitador`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data, "digitadores");
      setDigitador(data.expediente || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setBusqueda((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <strong>Búsqueda de Expedientes</strong>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="fecha_desp_inicio" className="form-label">
              Desde:
            </label>
            <input
              name="fecha_desp_inicio"
              type="datetime-local"
              className="form-control"
              onChange={handleChanges}
              value={busqueda.fecha_inicio || ""}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fecha_desp_fin" className="form-label">
              Hasta:
            </label>
            <input
              name="fecha_desp_fin"
              type="datetime-local"
              className="form-control"
              onChange={handleChanges}
              value={busqueda.fecha_fin || ""}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="jpl_select" className="form-label">
              Juzgado:
            </label>
            <select
              name="jpl_select"
              id=""
              onChange={handleChanges}
              value={busqueda.jpl}
            >
              <option value="jpl1">JPL 1</option>
              <option value="jpl2">JPL 2</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="digitador" className="form-label">
              Digitador:
            </label>
            <select name="digitador" id="">
              {digitador.map((d) => (
                <option value="">{d.nombre}</option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary">
              <i className="bi bi-list-columns-reverse"></i> Mostrar lista
            </button>
          </div>
          <div className="mt-4">
            <ListDespacho expediente={expediente} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DespachoExp;
