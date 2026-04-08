import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/listadoInventario.css";

function ListInventario() {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [lista, setLista] = useState([]);

  const navigate = useNavigate();

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
                  <th>Producto</th>
                  <th>Tipo producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unidad</th>
                  <th>Precio total</th>
                  <th>Ir...</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((l) => (
                  <tr key={l.id_producto}>
                    <td>{l.id_producto}</td>
                    <td>{l.nombre_producto}</td>
                    <td>{l.tipo_produ}</td>
                    <td>{l.cantidad}</td>
                    <td>{l.precio_unit}</td>
                    <td>{l.precio_total}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRedirect(l.id_producto)}
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
      </div>
    </>
  );
}

export default ListInventario;
