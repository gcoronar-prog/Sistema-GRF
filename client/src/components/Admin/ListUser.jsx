import React, { useEffect } from "react";
import { useState } from "react";

function ListUser() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    cod_user: "",
    user_name: "",
    nombre: "",
    apellido: "",
    user_password: "123456789",
    user_rol: "",
  });
  const [linkReset, setLinkReset] = useState("");
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;

  useEffect(() => {
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${servidor}/get/users`);
      const data = await response.json();
      setUsers(data.usuarios);
    } catch (error) {
      console.log(error);
    }
  };

  const loadUser = async (id) => {
    try {
      const response = await fetch(`${servidor}/login/${id}`);
      const data = await response.json();
      setUser(data.usuarios[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const eliminar = window.confirm("¿Deseas eliminar usuario?");
      if (!eliminar) return;
      await fetch(`${servidor}/delete/user/${id}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      });
      const updateList = users.filter((u) => u.id_user !== id);
      delete updateList[id];
      setUsers(updateList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = user.id_user
        ? `${servidor}/update/user/${user.id_user}`
        : `${servidor}/create/user`;
      const method = user.id_user ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(user),
      });

      console.log(user, "id form");
      setUser({
        cod_user: user.cod_user,
        user_name: user.user_name,
        nombre: user.nombre,
        apellido: user.apellido,
        user_rol: user.user_rol,
      });
      loadUser(user.id_user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const reqResetPassword = async (id) => {
    try {
      const res = await fetch(`${servidor}/reset/pass/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      alert("Reset contraseña generado");
      setLinkReset(data.link);
    } catch (error) {
      console.error(error);
    }
    console.log(id, "id user");
  };

  return (
    <>
      <table className="table table-striped table-hover table-bordered table-sm">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Código usuario</th>
            <th>Usuario</th>
            <th>Nombre usuario</th>
            <th>Apellido usuario</th>
            <th>Rol usuario</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id_user}>
              <td>{u.id_user}</td>
              <td>{u.cod_user}</td>
              <td>{u.user_name}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.user_rol}</td>
              <td>
                <button onClick={() => reqResetPassword(u.id_user)}>
                  Reset contraseña
                </button>
              </td>
              <td>
                <button onClick={() => loadUser(u.id_user)}>
                  Modificar usuario
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(u.id_user)}>
                  Eliminar usuario
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Codigo usuario</label>
        <input
          type="text"
          name="cod_user"
          value={user.cod_user || ""}
          onChange={handleChanges}
        />
        <label htmlFor="">Username</label>
        <input
          type="text"
          name="user_name"
          value={user.user_name || ""}
          onChange={handleChanges}
        />
        <label htmlFor="">Nombre usuario</label>
        <input
          type="text"
          name="nombre"
          value={user.nombre || ""}
          onChange={handleChanges}
        />
        <label htmlFor="">Apellido usuario</label>
        <input
          type="text"
          name="apellido"
          value={user.apellido || ""}
          onChange={handleChanges}
        />
        <label htmlFor="">Rol usuario</label>
        <input
          type="text"
          name="user_rol"
          value={user.user_rol || ""}
          onChange={handleChanges}
        />

        <button>Guardar</button>
      </form>
      <div className="justify-content p-2 w-50">
        link reinicio contraseña
        <p>{linkReset}</p>
      </div>
    </>
  );
}

export default ListUser;
