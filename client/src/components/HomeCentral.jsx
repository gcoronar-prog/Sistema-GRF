import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSGF from "./NavbarSGF";
import { jwtDecode } from "jwt-decode";
import ListPendiente from "./ListPendiente";

function HomeCentral() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    //console.log("token", token);
    /*if (!token) {
      alert("devulevete!");
      localStorage.removeItem("token");
      navigate("/sgf/v1/login/");
      return;
    }*/
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // tiempo actual en segundos

      if (decoded.exp < currentTime) {
        alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
        localStorage.removeItem("token");
        navigate("/sgf/v1/login/");
      }
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 401 || !res.ok) {
        alert("devulevete!");
        localStorage.removeItem("token");
        navigate("/sgf/v1/login/");

        return;
      }

      const data = await res.json();

      console.log(res.status);
      setUserData(data.msg[0]);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      navigate("/sgf/v1/login/");
    }
  };

  return (
    <>
      <NavbarSGF formulario={"central"} />
      {userData.user_rol ? (
        userData?.user_rol === "usercentral" ? (
          <ListPendiente />
        ) : (
          "soy de otra oficina"
        )
      ) : (
        <p>cargando la pagina</p>
      )}
      {/*<div className="toast-container position-fixed bottom-0 end-0 p-3">
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
      </div>*/}
      {new Date().toLocaleTimeString()}
    </>
  );
}

export default HomeCentral;
