import { forwardRef } from "react";
import logoSGIE from "/Users/gcorona/Desktop/Sistema GIE/client/src/img/logo_sgie.png";
import "./CSS/prestamoGRD.css";

const ProductosPDF = forwardRef(({ data }, ref) => {
  const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
  if (!data) return null;
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
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
  return (
    <>
      <div ref={ref} className="pdf-container">
        <div className="pdf-header">
          <div>
            <img src={logo} alt="" />
          </div>
          <div className="text-center">
            <h6 className="mb-0">ILUSTRE MUNICIPALIDAD DE SAN ANTONIO</h6>
            <small>Gestión de Riesgos y Desastres</small>

            <div className="text-center pt-2">
              <strong>Productos ingresados</strong>
              <br />
              <small>{formatDateTimeLocal(data.fecha_creado)}</small>
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

        {/* DATOS INGRESO */}
        <fieldset className="pdf-fieldset">
          <legend>Datos de productos</legend>

          <div className="row">
            <div className="col">
              <strong>Producto:</strong>
              <div>{data.id_producto}</div>
            </div>

            <div className="col">
              <strong>Tipo de producto:</strong>
              <div>{data.tipo_produ}</div>
            </div>

            <div className="col">
              <strong>N° de serie</strong>
              <div>{data.serial}</div>
            </div>

            <div className="col">
              <strong>Cantidad:</strong>
              <div>{data.cantidad + " " + data.unidad_medida}</div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <strong>Precio unitario:</strong>
              <div>${data.precio_unit}</div>
            </div>
            <div className="col">
              <strong>Precio total:</strong>
              <div>${data.precio_total}</div>
            </div>
            <div className="col">
              <strong>Ubicación:</strong>
              <div>{data.ubicacion}</div>
            </div>
            <div className="col"></div>
          </div>
        </fieldset>

        <hr />

        <fieldset className="pdf-fieldset">
          <div className="row">
            <div className="col">
              <strong>Observaciones:</strong>
              <div>{data.observ_produ}</div>
            </div>
          </div>
        </fieldset>

        {/* FIRMAS */}
        <div className="pdf-signatures pt-4">
          <div className="text-center">
            <div className="line"></div>
            <small>Firma y timbre Funcionario GRD</small>
          </div>
        </div>
      </div>
    </>
  );
});

export default ProductosPDF;
