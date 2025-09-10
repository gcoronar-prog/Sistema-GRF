import React from "react";

function ListDespacho({ expediente }) {
  return (
    <div className="mt-4">
      <h5 className="mb-3 text-secondary border-bottom pb-2">
        Resultados encontrados:
      </h5>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle text-center table-bordered table-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
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

export default ListDespacho;
