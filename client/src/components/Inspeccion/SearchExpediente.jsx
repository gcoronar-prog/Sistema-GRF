import React, { useState } from "react";
import ListSearchExpe from "./ListSearchExpe";

function SearchExpediente() {
  const [valorBusqueda, setValorBusqueda] = useState({
    rut_contri: "",
    ppu: "",
  });
  const [expediente, setExpediente] = useState([]);

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const buscaExpediente = async (rut, ppu) => {
    try {
      const res = await fetch(
        `${servidor_local}/search_expediente?rut=${rut}&ppu=${ppu}`
      );
      const data = await res.json();

      console.log(data, "expediente busqueda");

      // Guardar en el estado
      setExpediente(data.expedientes || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setValorBusqueda((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="form-label fw-bold">Busqueda de expedientes</span>
        </div>
        <div className="card-body">
          <div className=" gap-2 mt-3">
            <label htmlFor="control" className="form-label">
              Número de control:
            </label>
            <input name="control" type="text" className="form-control" />
          </div>

          <div className="gap-2 mt-3">
            <label htmlFor="rut_contri" className="form-label">
              RUT de Contribuyente:
            </label>
            <input
              name="rut_contri"
              className="form-control"
              onChange={handleChanges}
              value={valorBusqueda.rut_contri}
              type="text"
            />
          </div>

          <div className="gap-2 mt-3">
            <label htmlFor="ppu" className="form-label">
              PPU:
            </label>
            <input
              name="ppu"
              type="text"
              className="form-control"
              onChange={handleChanges}
              value={valorBusqueda.ppu}
            />
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              className="btn btn-primary"
              onClick={() =>
                buscaExpediente(valorBusqueda.rut_contri, valorBusqueda.ppu)
              }
            >
              <i className="bi bi-search"></i> Buscar
            </button>
          </div>
          <ListSearchExpe expediente={expediente} />
        </div>
      </div>
    </>
  );
}

export default SearchExpediente;
