import { forwardRef } from "react";
import logoSGIE from "../../img/logo_sgie.png";
import "./CSS/prestamoGRD.css";
import { jwtDecode } from "jwt-decode";

const ListPrestamoPDF = forwardRef(({ data }, ref) => {
  const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const user_decoded = decoded;
  const nombre_responsable = [user_decoded.nombre, user_decoded.apellido]
    .filter(Boolean)
    .join(" ");
  if (!data) return null;
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
              <small>Funcionario: {nombre_responsable}</small>
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
                <th>Usuario prestamo</th>
                <th>Fecha prestamo</th>
                <th>Fecha devolución</th>
                <th>Estado</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((l) => (
                <tr>
                  <td>{l.id_prestamo}</td>
                  <td>{l.user_prestamo}</td>
                  <td>{formatDateTimeLocal(l.fecha_prestamo)}</td>
                  <td>{formatDateTimeLocal(l.fecha_devolucion)}</td>
                  <td>{l.estado_prestamo}</td>
                  <td>{l.nombre_producto}</td>
                  <td>{l.cantidad}</td>
                  <td>{l.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
        </div>
      </div>
    </>
  );
});

export default ListPrestamoPDF;
