import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";

import { jwtDecode } from "jwt-decode";
import { useTokenSession } from "./useTokenSession";

function NavbarSGF() {
  const token = localStorage.getItem("token");

  /*useEffect(() => {
    console.log("Token en localStorage:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decodificado:", decoded.user_rol);
      } catch (e) {
        console.error("Error al decodificar:", e);
      }
    }
  }, []);*/

  const navigate = useNavigate();

  const user = useTokenSession();

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const handleLastInforme = async () => {
    const res = await fetch(`${servidor_local}/informe/central/last`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const lastInforme = await res.json();

    const id_informe = lastInforme.informe[0].id_informes_central;

    console.log(lastInforme);
    navigate(`/informes/central/${id_informe}`);
  };

  const handleLastExpediente = async () => {
    const res = await fetch(`${servidor_local}/last/exped`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const lastExpediente = await res.json();

    const id_informe = lastExpediente.expediente.id_expediente;

    console.log(lastExpediente);
    navigate(`/inspect/${id_informe}/edit`);
  };

  const rol = user.user_rol;
  /*if (!user) {
    return null;
  } else {
    console.log(rol);
  }*/
  console.log(rol);
  const handleLogOut = async () => {
    localStorage.removeItem("token");
    navigate("/sgf/v1/login/");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg border-bottom shadow-sm "
        style={{
          backgroundColor: "white",
        }}
      >
        <div className="container-fluid">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active fw-semibold" href="/">
                Inicio
              </a>
            </li>

            {user.user_rol === "usercentral" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" onClick={handleLastInforme}>
                    Informes Central Municipal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/statistics/central/v1">
                    Estadísticas Central Municipal
                  </Link>
                </li>
              </>
            )}

            {user.user_rol === "userinspeccion" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" onClick={handleLastExpediente}>
                    Expedientes Municipales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/statistics/inspeccion/v1">
                    Estadísticas Inspección Municipal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/galeriaImgExp">
                    Galería de Imágenes
                  </Link>
                </li>
              </>
            )}

            {user.user_rol === "superadmin" && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    href="#"
                  >
                    Formularios
                  </a>
                  <ul className="dropdown-menu">
                    <li key="1" className="dropdown-item">
                      <Link className="nav-link" onClick={handleLastExpediente}>
                        Expedientes Municipales
                      </Link>
                    </li>
                    <li key="2" className="dropdown-item">
                      <Link className="nav-link" onClick={handleLastInforme}>
                        Informes Central Municipal
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    href="#"
                  >
                    Estadísticas
                  </a>
                  <ul className="dropdown-menu">
                    <li key="1" className="dropdown-item">
                      <Link className="nav-link" to="/statistics/inspeccion/v1">
                        Estadísticas Inspección Municipal
                      </Link>
                    </li>
                    <li key="2" className="dropdown-item">
                      <Link className="nav-link" to="/statistics/central/v1">
                        Estadísticas Central Municipal
                      </Link>
                    </li>
                  </ul>
                </li>
                <li key="1" className="dropdown-item">
                  <Link className="nav-link" to="/galeriaImgExp">
                    Galería Inspección
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center border-start ps-3">
            <SearchForm formulario={rol} />
          </div>
        </div>

        <div>
          <button className="btn btn-danger" onClick={handleLogOut}>
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  );
}

export default NavbarSGF;
