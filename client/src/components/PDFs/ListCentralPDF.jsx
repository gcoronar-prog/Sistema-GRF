import { jwtDecode } from "jwt-decode";
import { forwardRef } from "react";
import logoSGIE from "/Users/gcorona/Desktop/Sistema GIE/client/src/img/logo_sgie.png";
import "./CSS/prestamoGRD.css";

const ListCentralPDF = forwardRef(({ data }, ref) => {
  const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
  console.log(data);
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
            <small>Central de comunicaciones municipal</small>

            <div className="text-center pt-2">
              <strong>Listado Informes Central Municipal</strong>
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
                <th>Código</th>
                <th>Fecha informe</th>
                <th>Clasificación</th>
                <th>Origen informe</th>
                <th>Informante</th>
                <th>Captura información</th>
                <th>Tipo de informe</th>
                <th>Sector</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              {data.map((i) => (
                <tr key={i.id_central}>
                  <td>{i.cod_informes_central}</td>
                  <td>{formatDateTimeLocal(i.fecha_informe)}</td>
                  <td>{i.clasificacion_informe?.label}</td>
                  <td>{i.origen_informe?.label}</td>
                  <td>{i.persona_informante?.label}</td>
                  <td>{i.captura_informe}</td>
                  <td>{i.tipo_informe?.label}</td>
                  <td>{i.sector_informe?.label}</td>
                  <td>{i.direccion_informe}</td>
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

export default ListCentralPDF;
