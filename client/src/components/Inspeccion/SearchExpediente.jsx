import React, { useState } from "react";
import ListSearchExpe from "./ListSearchExpe";

function SearchExpediente() {
  const [valorBusqueda, setValorBusqueda] = useState({
    rut_contri: "",
    ppu: "",
    num_control: "",
  });
  const [expediente, setExpediente] = useState([]);

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

  const buscaExpediente = async (rut, ppu, num_control) => {
    try {
      const res = await fetch(
        `${servidor_local}/search_expediente?rut=${rut}&ppu=${ppu}&num_control=${num_control}`,
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

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setValorBusqueda((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <strong>Búsqueda de Expedientes</strong>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="num_control" className="form-label">
              Número de control:
            </label>
            <input
              name="num_control"
              type="text"
              className="form-control"
              onChange={handleChanges}
              value={valorBusqueda.num_control}
              placeholder="Ingrese número de control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="rut_contri" className="form-label">
              RUT de Contribuyente:
            </label>
            <input
              name="rut_contri"
              className="form-control"
              onChange={handleChanges}
              value={valorBusqueda.rut_contri}
              type="text"
              placeholder="Ej: 12345678-9"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="ppu" className="form-label">
              PPU:
            </label>
            <input
              name="ppu"
              type="text"
              className="form-control"
              onChange={handleChanges}
              value={valorBusqueda.ppu}
              placeholder="Ingrese PPU del vehículo"
            />
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-primary"
              onClick={() =>
                buscaExpediente(
                  valorBusqueda.rut_contri,
                  valorBusqueda.ppu,
                  valorBusqueda.num_control
                )
              }
            >
              <i className="bi bi-search me-1"></i> Buscar
            </button>
          </div>
          <div className="mt-4">
            <ListSearchExpe expediente={expediente} />
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchExpediente;
