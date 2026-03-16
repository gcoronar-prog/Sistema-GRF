import React, { useEffect, useState } from "react";

function ListPrestamo() {
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [listado, setListado] = useState([]);

  useEffect(() => {
    listProductos();
  }, []);

  const listProductos = async () => {
    const res = await fetch(`${servidor}/inventario/listado`);
    if (!res.ok) throw new Error("Problemas obteniendo datos");
    const data = await res.json();
    setListado(data);
  };

  return (
    <>
      {console.log(listado)}
      <table border={1}>
        <tr>
          <th>ID</th>
        </tr>
        <tr>
          <td>{listado.map((l) => l.nombre_producto)}</td>
        </tr>
      </table>
    </>
  );
}

export default ListPrestamo;
