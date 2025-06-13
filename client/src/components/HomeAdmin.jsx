import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSGF from "./NavbarSGF";
import ListPendiente from "./ListPendiente";
import { AuthHome } from "../../../server/src/middlewares/AuthHome";
import ListExpe from "./Inspeccion/ListExpe";

function HomeAdmin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    AuthHome({ navigate, setUserData });
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    //console.log("token", token);
    if (!token) {
      navigate("/sgf/v1/login/");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        throw new Error("No autorizado");
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      navigate("/sgf/v1/login/");
    }
  };

  return (
    <>
      <NavbarSGF />

      {userData.user_rol ? (
        userData?.user_rol === "superadmin" ? (
          <ListExpe />
        ) : (
          "soy de otra oficina"
        )
      ) : (
        <p>cargando la pagina</p>
      )}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          className="toast show position-relative"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Bienvenido/a</strong>
            <small>{new Date().toLocaleTimeString()}</small>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{"Usuario: " + userData.user_name}</div>
        </div>
      </div>
    </>
  );
}

export default HomeAdmin;
