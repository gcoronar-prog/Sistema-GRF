import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTokenSession } from "./useTokenSession";

function FormAcciones({ tipo }) {
  const defaultAccion = {
    cod_accion: "",
    fecha_accion: "",
    desc_acciones: "",
    estado_accion: "",
    fecha_resolucion: "",
    isEditing: true,
  };

  const params = useParams();
  const [acciones, setAcciones] = useState([defaultAccion]);
  const token = localStorage.getItem("token");
  const userData = useTokenSession();

  useEffect(() => {
    if (params.id) {
      loadAcciones(params.id);
    } else {
      setAcciones([defaultAccion]);
    }
  }, [params.id]);

  const loadAcciones = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/acciones/${tipo}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Problemas obteniendo datos");
      const data = await res.json();

      const formattedData = data.acciones.map((accion) => ({
        cod_accion: accion.cod_accion,
        fecha_accion: dayjs(accion.fecha_accion).format("YYYY-MM-DDTHH:mm"),
        desc_acciones: accion.desc_acciones,
        estado_accion: accion.estado_accion,
        fecha_resolucion: dayjs(accion.fecha_resolucion).format(
          "YYYY-MM-DDTHH:mm"
        ),
        isEditing: true,
      }));

      setAcciones(formattedData);
    } catch (error) {
      console.error("Error cargando acciones:", error);
    }
  };

  const handleChanges = (e, codigo) => {
    const { name, value } = e.target;
    setAcciones((prev) =>
      prev.map((accion) =>
        accion.cod_accion === codigo ? { ...accion, [name]: value } : accion
      )
    );
    console.log(name, value);
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    const confirmar = window.confirm("¿Deseas guardar la acción?");
    if (!confirmar) return;
    const indi = params.id;

    const method = id.toString().startsWith("temp") ? "POST" : "PUT";
    try {
      const accionToSubmit = acciones.find(
        (accion) => accion.cod_accion === id
      );
      /*const url =
        indi != ""
          ? `http://localhost:3000/acciones`
          : `http://localhost:3000/acciones/${indi}`;*/
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/acciones/${tipo}/${indi}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(accionToSubmit), // Envía solo el registro específico
        }
      );

      if (!res.ok) {
        throw new Error("Error al guardar la acción");
      }
      setAcciones((prev) =>
        prev.map((accion) =>
          accion.cod_accion === id
            ? { ...accion, isEditing: !accion.isEditing }
            : accion
        )
      );
      console.log("Acción guardada correctamente:", acciones, method);
    } catch (error) {
      console.error("Error al guardar los datos:", error, method);
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar la acción?");
    if (!confirmar) return;
    await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/acciones/${tipo}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //const updateAccion = { ...acciones };
    //delete updateAccion[id];
    setAcciones(acciones.filter((a) => a.cod_accion !== id));
  };

  const handleEdit = (id) => {
    setAcciones((prev) =>
      prev.map((accion) =>
        accion.cod_accion === id
          ? { ...accion, isEditing: !accion.isEditing }
          : accion
      )
    );
  };

  const handleCancel = (id) => {
    if (id?.toString().startsWith("temp")) {
      setAcciones((prev) => prev.filter((accion) => accion.cod_accion !== id));
    } else {
      setAcciones((prev) =>
        prev.map((accion) =>
          accion.cod_accion === id
            ? { ...accion, isEditing: !accion.isEditing }
            : accion
        )
      );
    }
  };

  const handleNewData = (id) => {
    //console.log(id);
    if (!id) {
      setAcciones((prevAcciones) => [
        ...prevAcciones,
        {
          cod_accion: `temp-${Date.now()}`,
          isEditing: false,
        },
      ]);
      console.log("id accion:", id);
    }
  };

  return (
    <>
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-cente">
          <h5 className="mb-0"> Lista de acciones</h5>
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => handleNewData("")}
          >
            <i className="bi bi-plus-circle me-1"></i> Agregar acción
          </button>
        </div>

        <div className="card-body table-responsive px-2 py-3">
          <table className="table table-bordered table-hover align-middle text-center table-sm">
            <thead className="table-primary">
              <tr>
                <th style={{ minWidth: "140px" }}>Fecha</th>
                {tipo === "SGC" ? <th>Estado</th> : ""}

                <th style={{ width: "40%" }}>Descripción</th>
                {tipo === "SGC" ? (
                  <th style={{ minWidth: "140px" }}>Fecha Resolución</th>
                ) : (
                  ""
                )}
                <th colSpan={2}> </th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {acciones.map((a) =>
                a.isEditing ? (
                  <tr key={a.cod_accion}>
                    <td className="text-nowrap">
                      {new Date(a.fecha_accion).toLocaleDateString() +
                        "  " +
                        new Date(a.fecha_accion).toLocaleTimeString()}
                    </td>
                    {tipo === "SGC" ? <td>{a.estado_accion}</td> : ""}

                    <td className="text-start text-truncate">
                      {a.desc_acciones}
                    </td>
                    {tipo === "SGC" ? (
                      <td className="text-nowrap">
                        {new Date(a.fecha_resolucion).toLocaleDateString() +
                          "  " +
                          new Date(a.fecha_resolucion).toLocaleTimeString()}
                      </td>
                    ) : (
                      ""
                    )}

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleEdit(a.cod_accion)}
                      >
                        <i className="bi bi-pencil-square"></i> Editar
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(a.cod_accion)}
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={a.cod_accion}>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        name="fecha_accion"
                        type="datetime-local"
                        value={a.fecha_accion}
                        onChange={(e) => handleChanges(e, a.cod_accion)}
                      />
                    </td>
                    {tipo === "SGC" ? (
                      <td>
                        <select
                          className="form-select form-select-sm"
                          name="estado_accion"
                          id=""
                          value={a.estado_accion || ""}
                          onChange={(e) => handleChanges(e, a.cod_accion)}
                        >
                          <option value="">Seleccione estado</option>
                          <option value="pendiente">Pendiente</option>
                          <option value="completado">Completado</option>
                        </select>
                      </td>
                    ) : (
                      ""
                    )}

                    <td>
                      <textarea
                        className="form-control form-control-sm"
                        name="desc_acciones"
                        id=""
                        value={a.desc_acciones || ""}
                        onChange={(e) => handleChanges(e, a.cod_accion)}
                      ></textarea>
                    </td>
                    {tipo === "SGC" ? (
                      <td>
                        <input
                          className="form-control form-control-sm"
                          type="datetime-local"
                          name="fecha_resolucion"
                          value={a.fecha_resolucion}
                          onChange={(e) => handleChanges(e, a.cod_accion)}
                        />
                      </td>
                    ) : (
                      ""
                    )}

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => handleSubmit(e, a.cod_accion)}
                      >
                        <i className="bi bi-check-circle"></i> Guardar
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleCancel(a.cod_accion)}
                      >
                        <i className="bi bi-x-circle"></i> Cancelar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default FormAcciones;
