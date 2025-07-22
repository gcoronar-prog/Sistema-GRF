import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { rolesGrupo } from "../../../../server/src/middlewares/groupRole";
import logoSGIE from "../../img/logo_sgie.png";

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
        } else if (
          rolesGrupo.noinspeccion.includes(userRole) ||
          rolesGrupo.inspeccion.includes(userRole)
        ) {
          navigate("/home/inspeccion");
        } else if (userRole === "userseguridad") {
          navigate("/home/central");
        } else if (userRole === "usergrd") {
          navigate("/home/central");
        }
      }
      if (!res.ok) {
        window.alert("Usuario y/o contrasela incorrectos");
        setLogin(defaultValues);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-center mb-1">
          <img
            src={logoSGIE}
            alt="Logo"
            className="d-inline-block"
            width={210}
            height={230}
          />
        </div>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">🔐 Inicio Sesión</h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="user_name" className="form-label">
                👤 Usuario
              </label>
              <input
                type="text"
                className="form-control"
                id="user_name"
                name="user_name"
                value={login.user_name}
                onChange={handleChanges}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                🔒 Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={login.password}
                onChange={handleChanges}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Acceder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginSGF;
