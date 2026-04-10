import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/listadoInventario.css";
import ListPrestamoPDF from "../PDFs/ListPrestamoPDF";
import { useReactToPrint } from "react-to-print";

function ListUserPrestamo({ usuario }) {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const navigate = useNavigate();
  const printRef = useRef(null);

  useEffect(() => {
    if (usuario) {
      LoadListUser();
    }
  }, [usuario]);

  const [lista, setLista] = useState([]);

  const LoadListUser = async () => {
    try {
      const res = await fetch(
        `${servidor}/inventario/list/user?user=${encodeURIComponent(usuario)}`,
      );
      const data = await res.json();
      //console.log(data);
      setLista(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Prestamo de Productos",
  });

  const handleRedirect = async (id) => {
    try {
      const res = await fetch(`${servidor}/inventario/grd/${id}`);
      const data = await res.json();
      //console.log(data);
      navigate(`/grd/inventario/${id}/edit`);
    } catch (error) {
      console.error(error);
    }
  };

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
      <div className="card ms-4 me-2">
        <div className="card-header bg-success text-white d-flex justify-content-between p-4">
          <h5 className="card-title mb-0">Listado prestamo productos</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered table-striped-columns table-hover"
              data-bs-spy="scroll"
            >
              <thead>
                <tr className="table-info">
                  <th>ID Producto</th>
                  <th>Usuario prestamo</th>
                  <th>Fecha de prestamo</th>
                  <th>Producto</th>
                  <th>Cantidad Solicitada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((li) => (
                  <tr key={li.id_producto}>
                    <td>{li.id_producto}</td>
                    <td>{li.user_prestamo}</td>
                    <td>{formatDateTimeLocal(li.fecha_prestamo)}</td>
                    <td>{li.nombre_producto}</td>
                    <td>{li.cantidad}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRedirect(li.id_producto)}
                      >
                        Ir a producto...
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-end mt-3">
          <button className="btn btn-danger" onClick={handlePrint}>
            <i className="bi bi-file-earmark-pdf"></i>
            Descargar PDF
          </button>
        </div>
        <div style={{ display: "none" }}>
          <ListPrestamoPDF ref={printRef} data={lista} />
        </div>
      </div>
    </>
  );
}

export default ListUserPrestamo;
