import { forwardRef } from "react";
import logoSGIE from "/Users/gcorona/Desktop/Sistema GIE/client/src/img/logo_sgie.png";
import "./CSS/prestamoGRD.css";

const ListEntradaPDF = forwardRef(({ data }, ref) => {
  const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
  if (!data) return null;
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
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
    <>
      <div ref={ref} className="pdf-container">
        <style type="text/css" media="print">
          {"@page { size: landscape; }"}
        </style>
        <div className="pdf-header">
          <div>
            <img src={logo} alt="" />
          </div>
          <div className="text-center">
            <h6 className="mb-0">ILUSTRE MUNICIPALIDAD DE SAN ANTONIO</h6>
            <small>Gestión de Riesgos y Desastres</small>

            <div className="text-center pt-2">
              <strong>Inventario Entradas y salidas</strong>
              <br />
              <small>{formatDateTimeLocal(Date.now())}</small>
            </div>
          </div>
          <div>
            <img src={logoSGIE} alt="" style={{ width: "120px" }} />
          </div>
        </div>
        <hr />

        <div className="pdf-section">
          <table className="pdf-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo de producto</th>
                <th>Nombre producto</th>
                <th>Funcionario GRD</th>
                <th>Fecha ingreso</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Precio total</th>
                <th>Factura</th>
                <th>Orden de compra</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((l) => (
                <tr key={l.id_inventario}>
                  <td>{l.id_inventario}</td>
                  <td>{l.tipo_producto}</td>
                  <td>{l.nombre_producto}</td>
                  <td>{l.user_creador}</td>
                  <td>{formatDateTimeLocal(l.fecha_creado)}</td>
                  <td>{l.cantidad + " " + l.unid_medida}</td>
                  <td>$ {l.precio_unitario}</td>
                  <td>$ {l.precio_total}</td>
                  <td>{l.factura}</td>
                  <td>{l.orden_compra}</td>
                  <td>{l.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
});
export default ListEntradaPDF;
