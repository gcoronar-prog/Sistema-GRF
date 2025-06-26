import ListPendiente from "./ListPendiente";
import { useTokenSession } from "./useTokenSession";

function HomeCentral() {
  const userData = useTokenSession();

  return (
    <>
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
