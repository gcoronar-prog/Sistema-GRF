import React, { useEffect, useState } from "react";

function ListPrestamo() {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [listado, setListado] = useState([]);
  const [listaPrestamo, setListaPrestamo] = useState();

  useEffect(() => {
    listProductos();
  }, []);

  const listProductos = async () => {
    const res = await fetch(`${servidor}/inventario/prestamo/list`);
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();
    setListado(data);
  };

  return (
    <>
      <div className="container">
        <h3>Lista de productos</h3>
        <table border={1}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
            </tr>
          </thead>
          <tbody>
            {listado.map((l) => (
              <tr key={l.id_prestamo} style={{ cursor: "pointer" }}>
                <td>{l.id_prestamo}</td>
                <td>{l.user_prestamo}</td>
                <td>
                  <button
                    name="agregar"
                    onClick={() => handleClick(l.id_producto)}
                  >
                    Ir a...
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListPrestamo;
