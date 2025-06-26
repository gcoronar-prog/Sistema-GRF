import React, { useEffect, useState } from "react";
import ListPendiente from "./ListPendiente";
import ListExpe from "./Inspeccion/ListExpe";
import { useTokenSession } from "./useTokenSession";

function HomeAdmin() {
  const userData = useTokenSession();

  console.log(userData, "userData desde homeadmin");
  return (
    <>
      <div className="accordion" id="accordion-admin">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseCentral"
              aria-expanded="true"
              aria-controls="collapseCentral"
            >
              Listado Central Municipal
            </button>
          </h2>
          <div
            id="collapseCentral"
            className="accordion-collapse collapse"
            data-bs-parent="#accordion-admin"
          >
            <div className="accordion-body">
              {userData.user_rol ? (
                userData?.user_rol === "superadmin" ? (
                  <ListPendiente />
                ) : (
                  "soy de otra oficina"
                )
              ) : (
                <p>cargando la pagina</p>
              )}
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseInspeccion"
              aria-expanded="true"
              aria-controls="collapseInspeccion"
            >
              Listado Inspección Municipal
            </button>
          </h2>
          <div
            id="collapseInspeccion"
            className="accordion-collapse collapse"
            data-bs-parent="#accordion-admin"
          >
            <div className="accordion-body">
              {userData.user_rol ? (
                userData?.user_rol === "superadmin" ? (
                  <ListExpe />
                ) : (
                  "soy de otra oficina"
                )
              ) : (
                <p>cargando la pagina</p>
              )}
            </div>
          </div>
        </div>
      </div>

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
