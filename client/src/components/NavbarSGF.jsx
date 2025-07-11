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
  useEffect(() => {
    user;
  }, []);

  const handleLastInforme = async () => {
    const res = await fetch(`${servidor_local}/informe/central/last`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const lastInforme = await res.json();

    const id_informe = lastInforme.informe[0].id_informes_central;

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

    navigate(`/inspect/${id_informe}/edit`);
  };

  const rol = user.user_rol;
  /*if (!user) {
    return null;
  } else {
    console.log(rol);
  }*/

  const handleLogOut = async () => {
    localStorage.removeItem("token");
    navigate("/sgf/v1/login/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">
            Inicio
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* User Central */}
              {user.user_rol === "usercentral" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleLastInforme}>
                      <i className="bi bi-clipboard-check me-1"></i> Informes
                      Central
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/statistics/central/v1">
                      <i className="bi bi-bar-chart me-1"></i> Estadísticas
                      Central
                    </Link>
                  </li>
                </>
              )}

              {/* User Inspección o JPL */}
              {(user.user_rol === "userinspeccion" ||
                user.user_rol === "userjpl") && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleLastExpediente}>
                      <i className="bi bi-folder2-open me-1"></i> Expedientes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/statistics/inspeccion/v1">
                      <i className="bi bi-bar-chart me-1"></i> Estadísticas
                      Inspección
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/galeriaImgExp">
                      <i className="bi bi-image me-1"></i> Galería de Imágenes
                    </Link>
                  </li>
                </>
              )}

              {/* Superadmin */}
              {user.user_rol === "superadmin" && (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Formularios
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={handleLastExpediente}
                        >
                          Expedientes Municipales
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={handleLastInforme}
                        >
                          Informes Central Municipal
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Estadísticas
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/statistics/inspeccion/v1"
                        >
                          Estadísticas Inspección
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/statistics/central/v1"
                        >
                          Estadísticas Central
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/galeriaImgExp">
                      Galería Inspección
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Buscador */}
            <div className="d-flex align-items-center me-3">
              <SearchForm formulario={user.user_rol} />
            </div>

            {/* Botón de logout */}
            <button className="btn btn-outline-danger" onClick={handleLogOut}>
              <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarSGF;
