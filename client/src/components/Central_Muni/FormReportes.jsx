import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FormReportes() {
  const defaultReportes = {
    id_reporte_service: "",
    cod_reporte_service: "",
    fecha_reporte: "",
    usuario_reporte: "",
    vehiculo_reporte: "",
    tipo_reporte: "",
    usuario_crea: "",
  };
  const params = useParams();
  const navigate = useNavigate();
  const [reportes, setReportes] = useState({ defaultReportes });
  const [lastId, setLastId] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadReportes(params.id);
    } else {
      setReportes(defaultReportes);
    }
  }, [params.id]);

  const loadReportes = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/reportes/${id}`);
      const data = await response.json();
      const formattedFecha = dayjs(
        data.reporte_seleccionado[0].fecha_reporte
      ).format("YYYY-MM-DDTHH:mm");
      setReportes({
        id_reporte_service: data.reporte_seleccionado[0].id_reporte_service,
        cod_reporte_service: data.reporte_seleccionado[0].cod_reporte_service,
        fecha_reporte: formattedFecha,
        usuario_reporte: data.reporte_seleccionado[0].usuario_reporte,
        vehiculo_reporte: data.reporte_seleccionado[0].vehiculo_reporte,
        tipo_reporte: data.reporte_seleccionado[0].tipo_reporte,
        usuario_crea: data.reporte_seleccionado[0].usuario_crea,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setReportes({ ...reportes, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = params.id
        ? `http://localhost:3000/reportes/${params.id}`
        : "http://localhost:3000/reportesService";
      const method = params.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportes),
      });

      if (!res.ok) {
        throw new Error("Error en la petición");
      }

      const lastReporteData = await fetch(
        "http://localhost:3000/reportesService/last"
      );
      const lastReporte = await lastReporteData.json();
      setLastId(lastReporte[0].id_reporte_service);

      if (lastReporte) {
        navigate(`/reporte/${lastReporte[0].id_reporte_service + 1}`);
      }

      const metodo = params.id ? "" : `/reporte/${lastId + 1}`;
      navigate(metodo);
      setEditing(false);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Problemas de conexión" });
    }
    setEditing(false);
  };

  const handleFirstReporte = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/reportesService/first"
      );
      if (response.ok) {
        const firsRepo = await response.json();
        if (firsRepo) {
          const id_repo = firsRepo[0].id_reporte_service;
          navigate(`/reporte/${id_repo}`);
        } else {
          console.log("no hay reportes");
        }
      } else {
        console.log("Error obteniendo registros");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrevReporte = async () => {
    const id = params.id;
    try {
      const response = await fetch(
        `http://localhost:3000/reportesService/prev/${id}`
      );
      const data = await response.json();
      if (data[0]?.id_reporte_service > 0) {
        navigate(`/reporte/${data[0].id_reporte_service}`);
      } else {
        console.log("No hay registros anteriores");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextReporte = async () => {
    const id = params.id;
    try {
      const response = await fetch(
        `http://localhost:3000/reportesService/next/${id}`
      );
      const data = await response.json();
      navigate(`/reporte/${data[0].id_reporte_service}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLastReporte = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/reportesService/last"
      );
      if (response.ok) {
        const lastRepo = await response.json();
        if (lastRepo) {
          console.log(lastRepo[0].id_reporte_service);
          navigate(`/reporte/${lastRepo[0].id_reporte_service}`);
        } else {
          console.log("no hay reportes");
        }
      }
    } catch (error) {
      console.error(error);
    }
    setEditing(false);
  };

  const handleNewReporte = () => {
    navigate("/reporte/new");
    setEditing(true);
  };

  const handleEditReporte = () => {
    navigate(`/reporte/${params.id}`);
    setEditing(true);
  };

  const handleDeleteReporte = async () => {
    const id = params.id;
    await fetch(`http://localhost:3000/reportes/${id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const updatedReportes = { ...reportes };
    delete updatedReportes[id];
    setReportes(updatedReportes);

    const res = await fetch("http://localhost:3000/reportesService/last");
    const data = await res.json();
    navigate(`/reporte/${data[0].id_reporte_service}`);
  };

  return (
    <div>
      <h5>Ingrese reporte</h5>

      <button
        type="button"
        onClick={handleFirstReporte}
        disabled={
          //disabledPrevButton
          false
        }
      >
        Primera solicitud
      </button>
      <button
        type="button"
        onClick={handlePrevReporte}
        disabled={
          //disabledPrevButton
          false
        }
      >
        Atras
      </button>

      <button
        type="button"
        onClick={handleNextReporte}
        disabled={
          //disabledNextButton
          false
        }
      >
        Siguiente
      </button>
      <button
        type="button"
        onClick={handleLastReporte}
        disabled={
          false
          //disabledNextButton
        }
      >
        Último
      </button>
      <br />
      <br />
      <strong>Código del reporte:</strong>
      <span name="cod_reporte_service" id="cod_reporte_service">
        {reportes.cod_reporte_service}
      </span>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fecha_reporte" className="form-label">
            Fecha
          </label>
          {editing ? (
            <input
              type="datetime-local"
              className="form-control"
              id=""
              name="fecha_reporte"
              onChange={handleChanges}
              value={reportes.fecha_reporte}
            />
          ) : (
            <span>{reportes.fecha_reporte}</span>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="usuario_reporte" className="form-label">
            Usuario Informante
          </label>
          {editing ? (
            <select
              name="usuario_reporte"
              id="usuario_reporte"
              onChange={handleChanges}
              value={reportes.usuario_reporte}
            >
              <option value="">Seleccione Informante</option>
              <option value="usuario 1">Usuario 1</option>
            </select>
          ) : (
            <span>{reportes.usuario_reporte}</span>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="vehiculo_reporte" className="form-label">
            Vehículo
          </label>
          {editing ? (
            <select
              name="vehiculo_reporte"
              id="vehiculo_reporte"
              onChange={handleChanges}
              value={reportes.vehiculo_reporte}
            >
              <option value="">Seleccione opción</option>
              <option value="vehiculo 1">Vehiculo 1</option>
            </select>
          ) : (
            <span>{reportes.vehiculo_reporte}</span>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="tipo_reporte" className="form-label">
            Tipo
          </label>
          {editing ? (
            <select
              name="tipo_reporte"
              id="tipo_reporte"
              onChange={handleChanges}
              value={reportes.tipo_reporte}
            >
              <option value="">Seleccione opción</option>
              <option value="inicio servicio">Inicio de servicio</option>
              <option value="fin servicio">Fin de servicio</option>
            </select>
          ) : (
            <span>{reportes.tipo_reporte}</span>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="usuario_crea" className="form-label">
            Usuario crea
          </label>
          {editing ? (
            <input
              type="text"
              className="form-control"
              id="usuario_crea"
              name="usuario_crea"
              onChange={handleChanges}
              value={reportes.usuario_crea}
            />
          ) : (
            <span>{reportes.usuario_crea}</span>
          )}
        </div>

        {/*BOTOOOOONEEEEEEEEEEEEEES!!!!! */}
        <button type="button" onClick={handleNewReporte}>
          Nuevo Reporte
        </button>
        <button
          type="button"
          onClick={handleEditReporte}
          style={{ display: editing ? "none" : "" }}
        >
          Editar
        </button>
        <button type="submit" style={{ display: editing ? "" : "none" }}>
          Guardar Reporte
        </button>
        <button
          type="button"
          onClick={handleLastReporte}
          style={{ display: editing ? "" : "none" }}
        >
          Cancelar
        </button>
        <button type="button" onClick={handleDeleteReporte}>
          Eliminar
        </button>
      </form>
    </div>
  );
}

export default FormReportes;
