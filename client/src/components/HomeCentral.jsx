import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSGF from "./NavbarSGF";
import ListPendiente from "./ListPendiente";

function HomeCentral() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    //console.log("token", token);
    if (!token) {
      alert("devulevete!");
      localStorage.removeItem("token");
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
      const data = await res.json();

      if (res.status === 401) {
        alert("devulevete!");
        localStorage.removeItem("token");
        navigate("/sgf/v1/login/");
        return;
      }
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

export default HomeCentral;
