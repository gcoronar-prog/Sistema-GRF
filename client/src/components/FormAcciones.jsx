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

  const handleSubmit = async (e, id, indi) => {
    e.preventDefault();
    indi = params.id;

    const method = id ? "PUT" : "POST";
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
      console.log("Acción guardada correctamente:", acciones);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/acciones/${id}`, {
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

  const handleNewData = (id) => {
    console.log(id);
    setAcciones((prevAcciones) => [...prevAcciones, { ...defaultAccion }]);
    setAcciones((prev) =>
      prev.map((accion) =>
        accion.cod_accion === id
          ? { ...accion, isEditing: !accion.isEditing }
          : accion
      )
    );
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Estado acción</th>
            <th>Descripción</th>
            <th>Fecha Resolución</th>
          </tr>
        </thead>
        <tbody>
          {acciones.map((a) =>
            a.isEditing ? (
              <tr key={a.cod_accion}>
                <td>
                  {new Date(a.fecha_accion).toLocaleDateString() +
                    "  " +
                    new Date(a.fecha_accion).toLocaleTimeString()}
                </td>
                <td>{a.estado_accion}</td>
                <td>{a.desc_acciones}</td>
                <td>{a.fecha_resolucion}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(a.cod_accion)}
                  >
                    Editar
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.cod_accion)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={a.cod_accion}>
                <td>
                  <input
                    name="fecha_accion"
                    type="datetime-local"
                    value={a.fecha_accion}
                    onChange={(e) => handleChanges(e, a.cod_accion)}
                  />
                </td>
                <td>
                  <select
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
                <td>
                  <textarea
                    name="desc_acciones"
                    id=""
                    value={a.desc_acciones || ""}
                    onChange={(e) => handleChanges(e, a.cod_accion)}
                  ></textarea>
                </td>
                <td>
                  <input
                    type="datetime-local"
                    name="fecha_resolucion"
                    value={a.fecha_resolucion}
                    onChange={(e) => handleChanges(e, a.cod_accion)}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, a.cod_accion, params.id)}
                  >
                    Guardar
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(a.cod_accion)}
                  >
                    Cancelar
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.cod_accion)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <button type="button" onClick={() => handleNewData("")}>
        Agregar acción
      </button>
    </div>
  );
}

export default FormAcciones;
