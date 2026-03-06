import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PrestamoInventario() {
  const defaultPrestamo = {
    nombre: "",
    marca: "",
    modelo: "",
    serial: "",
    cantidad: 0,
    user_prestamo: "",
    estado_prestamo: "",
    fecha_prestamo: "",
    fecha_devolucion: "",
    observ: "",
  };

  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");

  const [prestamos, setPrestamos] = useState(defaultPrestamo);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    loadPrestamo(params.id);
  }, [params.id]);

  const loadPrestamo = async (id) => {
    const res = await fetch(`${servidor}/inventario/prestamo/${id}`, {
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPrestamos({
      ...defaultPrestamo,
      ...data[0],
      nombre: data[0].nombre || "",
      marca: data[0].marca || "",
      modelo: data[0].modelo || "",
      serial: data[0].serial || "",
      cantidad: data[0].cantidad || 0,
      user_prestamo: data[0].user_prestamo || "",
      estado_prestamo: data[0].estado_prestamo || "",
      fecha_prestamo: data[0].fecha_prestamo || "",
      fecha_devolucion: data[0].fecha_devolucion || "",
      observ: data[0].observ || "",
    });
  };
  return <>{console.log(prestamos.id_prestamo)}</>;
}

export default PrestamoInventario;
