import React, { useState } from "react";

function ListSearchExpe({ expediente }) {
  if (!expediente || expediente.length === 0) {
    return <p>No hay resultados para mostrar.</p>;
  }

  return (
    <div className="mt-3">
      <h5>Resultados encontrados:</h5>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered table-sm">
          <thead className="table-dark">
            <tr>
              <th>Expediente ID</th>
              <th>Contribuyente</th>
              <th>PPU</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {expediente.map((item, index) => (
              <tr key={index}>
                <td>{item.id_expediente}</td>
                <td>{item.rut_contri}</td>
                <td>{item.ppu}</td>
                <td>{new Date(item.fecha_infraccion).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListSearchExpe;
