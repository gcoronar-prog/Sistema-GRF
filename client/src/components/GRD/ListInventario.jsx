import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/listadoInventario.css";
import { useReactToPrint } from "react-to-print";
import ListProductosPDF from "../PDFs/ListProductosPDF";

function ListInventario() {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [lista, setLista] = useState([]);

  const navigate = useNavigate();
  const printRef = useRef(null);

  useEffect(() => {
    loadLista();
  }, []);

  const loadLista = async () => {
    try {
      const res = await fetch(`${servidor}/inventario/listado`);
      const data = await res.json();
      setLista(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Inventario Productos",
  });

  const handleRedirect = async (id) => {
    try {
      navigate(`/grd/inventario/${id}/edit`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="card ms-4 me-2">
        <div className="card-header bg-success text-white d-flex justify-content-between p-4">
          <h5 className="card-title mb-0">Listado de productos </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped-columns table-hover">
              <thead className="table-info">
                <tr>
                  <th>ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Producto</th>
                  <th>Tipo producto</th>
                  <th>Ir...</th>
                </tr>
              </thead>
              <tbody>
                {lista.length !== 0 ? (
                  lista.map((l) => (
                    <tr key={l.id_producto}>
                      <td>{l.id_producto}</td>
                      <td>{l.marca_producto}</td>
                      <td>{l.modelo}</td>
                      <td>{l.nombre_producto}</td>
                      <td>{l.tipo_produ}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleRedirect(l.id_producto)}
                        >
                          Ir a...
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay productos registrados
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
          <ListProductosPDF ref={printRef} data={lista} />
        </div>
      </div>
    </>
  );
}

export default ListInventario;
