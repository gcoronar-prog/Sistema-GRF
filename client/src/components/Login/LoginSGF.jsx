import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function LoginSGF() {
  const defaultValues = {
    user_name: "",
    password: "",
  };

  const navigate = useNavigate();

  const [login, setLogin] = useState(defaultValues);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(login),
        }
      );
      if (res.ok) {
        const data = await res.json();
        //console.log("Token recibido:", data.msg);
        localStorage.setItem("token", data.msg);
        console.log(data.msg, "token");
        const decode = jwtDecode(data.msg);
        const userRole = decode.user_rol;

        if (userRole === "superadmin") {
          navigate("/home/admin");
        } else if (userRole === "usercentral") {
          navigate("/home/central");
        } else if (userRole === "userinspeccion") {
          navigate("/home/central");
        } else if (userRole === "userseguridad") {
          navigate("/home/central");
        } else if (userRole === "usergrd") {
          navigate("/home/central");
        }
      }
      console.log(jwtDecode(localStorage.getItem("token")));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  return (
    <div>
      <h4>Login SGF</h4>

      <form onSubmit={handleSubmit}>
        <label htmlFor="">Usuario</label>
        <input
          type="text"
          name="user_name"
          onChange={handleChanges}
          value={login.user_name}
        />
        <label htmlFor="">Contraseña</label>
        <input
          type="password"
          name="password"
          onChange={handleChanges}
          value={login.password}
        />

        <button type="submit">Acceder</button>
      </form>
    </div>
  );
}

export default LoginSGF;
