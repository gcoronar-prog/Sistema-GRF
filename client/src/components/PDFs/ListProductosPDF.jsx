import { forwardRef } from "react";
import logoSGIE from "/Users/gcorona/Desktop/Sistema GIE/client/src/img/logo_sgie.png";
import "./CSS/prestamoGRD.css";
import { jwtDecode } from "jwt-decode";

const ListProductosPDF = forwardRef(({ data }, ref) => {
  const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
  if (!data) return null;
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const user_decoded = decoded;
  const nombre_responsable = [user_decoded.nombre, user_decoded.apellido]
    .filter(Boolean)
    .join(" ");

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
                <th>Marca</th>
                <th>Modelo</th>
                <th>Producto</th>
                <th>Tipo producto</th>
                <th>Unidad de medida</th>
              </tr>
            </thead>
            <tbody>
              {data.map((l) => (
                <tr key={l.id_producto}>
                  <td>{l.id_producto}</td>
                  <td>{l.marca_producto}</td>
                  <td>{l.modelo}</td>
                  <td>{l.nombre_producto}</td>
                  <td>{l.tipo_produ}</td>
                  <td>{l.unidad_medida}</td>
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

export default ListProductosPDF;
