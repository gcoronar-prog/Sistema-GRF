import { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/listadoInventario.css";
import ListEntradaPDF from "../PDFs/ListEntradaPDF";
import { useReactToPrint } from "react-to-print";

function ListEntradas() {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const [lista, setLista] = useState([]);
  const [tipo, setTipo] = useState("entrada");
  const [estado, setEstado] = useState(1);
  const printRef = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (tipo) {
      loadLista();
    }
  }, [tipo]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Entrada/Salida Inventario",
  });

  const loadLista = async () => {
    try {
      const res = await fetch(
        `${servidor}/inventario/lista/entrada/?tipo=${encodeURIComponent(tipo)}`,
      );
      const data = await res.json();
      console.log(data, tipo);
      setLista(data);
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

  const handleRedirect = async (id) => {
    try {
      const res = await fetch(`${servidor}/inventario/entrada/${id}`);
      const data = await res.json();
      //console.log(data);
      navigate(`/grd/inventario/entrada/${id}/edit`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="card ms-5">
        <div className="card-header bg-success text-white d-flex justify-content-between p-4">
          <h5 className="card-title mb-0">Listado de {tipo} </h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-center mb-3 gap-2 flex-wrap">
            <div className="btn-group mb-2">
              <button
                type="button"
                className={`btn ${
                  estado === 1 ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => {
                  (setEstado(1), setTipo("entrada"));
                }}
              >
                Entradas
              </button>
              <button
                type="button"
                className={`btn ${
                  estado === 2 ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => {
                  (setEstado(2), setTipo("salida"));
                }}
              >
                Salidas
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped-columns table-hover">
              <thead className="table-info">
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Usuario creador</th>
                  <th>Fecha creación</th>
                  <th>Cantidad</th>
                  <th>Unidad de medida</th>
                  <th>Observaciones</th>
                  <th>Ir...</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((l) => (
                  <tr key={l.id_inventario}>
                    <td>{l.id_inventario}</td>
                    <td>{l.nombre_producto}</td>
                    <td>{l.user_creador}</td>
                    <td>{formatDateTimeLocal(l.fecha_creado)}</td>
                    <td>{l.cantidad}</td>
                    <td>{l.unid_medida}</td>
                    <td>{l.observaciones}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRedirect(l.id_inventario)}
                      >
                        Ir a...
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-danger" onClick={handlePrint}>
            <i className="bi bi-file-earmark-pdf"></i>
            Descargar PDF
          </button>
        </div>
        <div style={{ display: "none" }}>
          <ListEntradaPDF ref={printRef} data={lista} />
        </div>
      </div>
    </>
  );
}

export default ListEntradas;
