import React, { useState } from "react";

function SearchExpediente() {
  const [valorBusqueda, setValorBusqueda] = useState([]);

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
            <label htmlFor="rutContribuyente" className="form-label">
              RUT de Contribuyente:
            </label>
            <input
              name="rutContribuyente"
              className="form-control"
              type="text"
            />
          </div>

          <div className="gap-2 mt-3">
            <label htmlFor="ppu" className="form-label">
              PPU:
            </label>
            <input name="ppu" type="text" className="form-control" />
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-primary">
              <i className="bi bi-search"></i> Buscar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchExpediente;
