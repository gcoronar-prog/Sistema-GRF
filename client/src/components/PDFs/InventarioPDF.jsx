import { forwardRef } from "react";
import "./CSS/prestamoGRD.css";
import logoSGIE from "../../img/logo_sgie.png";

const InventarioPDF = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(date.getDate())}-${pad(
      date.getMonth() + 1,
    )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(
      date.getMinutes(),
    )} hrs.`;
  };
  const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
  return (
    <div ref={ref} className="pdf-container">
      {/* HEADER */}
      <div className="pdf-header">
        <div>
          <img src={logo} alt="" />
        </div>
        <div className="text-center">
          <h6 className="mb-0">ILUSTRE MUNICIPALIDAD DE SAN ANTONIO</h6>
          <small>Gestión de Riesgos y Desastres</small>

          <div className="text-center pt-2">
            <strong>FORMULARIO DE PRÉSTAMO</strong>
            <br />
            <small>{formatDateTimeLocal(data.fecha_prestamo)}</small>
          </div>
        </div>
        <div>
          <img src={logoSGIE} alt="" style={{ width: "120px" }} />
        </div>
      </div>

      <hr />

      {/* INFO GENERAL */}
      <div className="pdf-section">
        <div className="row">
          <div className="col">
            <strong>Funcionario GRD:</strong>
            <div>{data.user_creador}</div>
          </div>
        </div>
      </div>

      {/* DATOS SOLICITANTE */}
      <fieldset className="pdf-fieldset">
        <legend>Datos del solicitante</legend>

        <div className="row">
          <div className="col">
            <strong>Nombre:</strong>
            <div>{data.user_prestamo}</div>
          </div>

          <div className="col">
            <strong>Correo:</strong>
            <div>{data.correo}</div>
          </div>

          <div className="col">
            <strong>Teléfono:</strong>
            <div>{data.telefono}</div>
          </div>
        </div>
      </fieldset>

      {/* DETALLE */}
      <div className="pdf-section">
        <h5 className="section-title">Detalle de préstamo</h5>

        <table className="pdf-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>N° Serie</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Devolución</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{data.id_producto}</td>
              <td>{data.nombre_producto}</td>
              <td>{data.num_serie}</td>
              <td>{data.cantidad}</td>
              <td>{data.estado_prestamo}</td>
              <td>{formatDateTimeLocal(data.fecha_prestamo)}</td>
              <td>{formatDateTimeLocal(data.fecha_devolucion)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FIRMAS */}
      <div className="pdf-signatures pt-3">
        <div className="text-center">
          <div className="line"></div>
          <small>Firma solicitante</small>
        </div>

        <div className="text-center">
          <div className="line"></div>
          <small>Firma y timbre Funcionario GRD</small>
        </div>
      </div>
    </div>
  );
});

export default InventarioPDF;
