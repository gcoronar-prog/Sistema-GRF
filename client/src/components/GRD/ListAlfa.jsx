import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import ListAlfaPDF from "../PDFs/ListAlfaPDF";

function ListAlfa() {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [lista, setLista] = useState([]);

  const navigate = useNavigate();
  const printRef = useRef(null);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    try {
      const res = await fetch(`${servidor}/alfa_grd/informes`);
      const data = await res.json();

      setLista(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirect = async (id) => {
    try {
      navigate(`/alfa/${id}/edit`);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Informes ALFA",
  });

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    if (!dateString) return "";
    const pad = (n) => String(n).padStart(2, "0");

    return (
      pad(date.getDate()) +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  return (
    <>
      <div className="card ms-4 me-2">
        <div className="card-header bg-danger text-white d-flex justify-content-between p-4">
          <h5 className="card-title mb-0">Lista informes ALFA</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped-columns table-hover">
              <thead className="table-info">
                <tr>
                  <th>Código</th>
                  <th>Fecha ocurrencia</th>
                  <th>Evaluación daños</th>
                  <th>Monto daños</th>
                  <th>Dirección</th>
                  <th>Tipo Ubicación</th>
                  <th>Ir...</th>
                </tr>
              </thead>
              <tbody>
                {lista.length !== 0 ? (
                  lista.map((i) => (
                    <tr key={i.id_alfa}>
                      <td>{i.cod_alfa}</td>
                      <td>{formatDateTimeLocal(i.fecha_ocurrencia)}</td>
                      <td>{i.ev_danio}</td>
                      <td>{i.monto_danio}</td>
                      <td>{i.direccion}</td>
                      <td>{i.tipo_ubicacion}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleRedirect(i.id_alfa)}
                        >
                          Ir...
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay informes ALFA registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-end mt-3">
          {lista.length !== 0 && (
            <button className="btn btn-danger" onClick={handlePrint}>
              <i className="bi bi-file-earmark-pdf"></i>
              Descargar PDF
            </button>
          )}
        </div>
        <div style={{ display: "none" }}>
          <ListAlfaPDF ref={printRef} data={lista} />
        </div>
      </div>
    </>
  );
}

export default ListAlfa;
