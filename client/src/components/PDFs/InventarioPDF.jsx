import { forwardRef } from "react";

const InventarioPDF = forwardRef(({ data }, ref) => {
  if (!data) return null;
  const lista = [data];

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);

    const pad = (n) => String(n).padStart(2, "0");

    return (
      date.getDate() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getFullYear()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      "hrs."
    );
  };
  return (
    <div ref={ref} className="inventario-grd-pdf">
      <div>
        <div className="row">
          <div className="col">
            <span>{formatDateTimeLocal(data.fecha_prestamo)}</span>
          </div>
          <div className="col">
            Funcionario GRD:
            <u>{data.user_creador}</u>
          </div>
        </div>
        <fieldset className="border border-dark-subtle rounded p-3">
          <legend className="float-none w-auto px-2 h6 mb-0">
            Datos solicitante
          </legend>
          <span>{data.user_prestamo}</span>
          <span>{data.correo}</span>
          <span>{data.telefono}</span>
        </fieldset>
      </div>

      <h4>Detalle de prestamos</h4>
      <table className="table table-sm table-bordered table-striped-columns table-hover">
        <thead>
          <tr className="table-info">
            <th>ID Producto</th>
            <th>Usuario prestamo</th>
            <th>Fecha de prestamo</th>
            <th>Fecha devolución</th>
            <th>Producto</th>
            <th>N° Serie</th>
            <th>Estado</th>
            <th>Cantidad Solicitada</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((li) => (
            <tr key={li.id_producto}>
              <td>{li.id_producto}</td>
              <td>{li.user_prestamo}</td>
              <td>{formatDateTimeLocal(li.fecha_prestamo)}</td>
              <td>{formatDateTimeLocal(li.fecha_devolucion)}</td>
              <td>{li.nombre_producto}</td>
              <td>{li.num_serie}</td>
              <td>{li.estado_prestamo}</td>
              <td>{li.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default InventarioPDF;
