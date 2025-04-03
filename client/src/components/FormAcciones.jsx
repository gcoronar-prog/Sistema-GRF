import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  useEffect(() => {
    if (params.id) {
      loadAcciones(params.id);
    } else {
      setAcciones([defaultAccion]);
    }
  }, [params.id]);

  const loadAcciones = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/acciones/${tipo}/${id}`);
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
        `http://localhost:3000/acciones/${tipo}/${indi}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
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
    await fetch(`http://localhost:3000/acciones/${tipo}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
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
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <table className="table table-striped table-hover table-bordered align-middle caption-top table-sm">
          <caption className="text-center fw-bold">Lista de acciones</caption>
          <thead className="table-primary text-center">
            <tr>
              <th>Fecha</th>
              {tipo === "SGC" ? <th>Estado acción</th> : ""}

              <th className="w-50">Descripción</th>
              {tipo === "SGC" ? <th>Fecha Resolución</th> : ""}
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody className="table-group-divider text-center">
            {acciones.map((a) =>
              a.isEditing ? (
                <tr key={a.cod_accion}>
                  <td>
                    {new Date(a.fecha_accion).toLocaleDateString() +
                      "  " +
                      new Date(a.fecha_accion).toLocaleTimeString()}
                  </td>
                  {tipo === "SGC" ? <td>{a.estado_accion}</td> : ""}

                  <td>{a.desc_acciones}</td>
                  {tipo === "SGC" ? (
                    <td>
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
                      className="btn btn-sm btn-outline-success me-2"
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
                      className="form-control"
                      name="fecha_accion"
                      type="datetime-local"
                      value={a.fecha_accion}
                      onChange={(e) => handleChanges(e, a.cod_accion)}
                    />
                  </td>
                  {tipo === "SGC" ? (
                    <td>
                      <select
                        className="form-select"
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
                      className="form-control"
                      name="desc_acciones"
                      id=""
                      value={a.desc_acciones || ""}
                      onChange={(e) => handleChanges(e, a.cod_accion)}
                    ></textarea>
                  </td>
                  {tipo === "SGC" ? (
                    <td>
                      <input
                        className="form-control"
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
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={(e) => handleSubmit(e, a.cod_accion)}
                    >
                      <i className="bi bi-check-circle"></i> Guardar
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning me-2"
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
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => handleNewData("")}
        >
          <i className="bi bi-plus-circle"></i> Agregar acción
        </button>
      </div>
    </>
  );
}

export default FormAcciones;
