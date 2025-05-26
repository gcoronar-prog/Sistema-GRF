import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";

function NavbarSGF({ formulario }) {
  const navigate = useNavigate();

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const handleLastInforme = async () => {
    const res = await fetch(`${servidor_local}/informe/central/last`);

    const lastInforme = await res.json();

    const id_informe = lastInforme.informe[0].id_informes_central;

    console.log(lastInforme);
    navigate(`/informes/central/${id_informe}`);
  };

  const handleLastExpediente = async () => {
    const res = await fetch(`${servidor_local}/last/exped`);

    const lastExpediente = await res.json();

    const id_informe = lastExpediente.expediente.id_expediente;

    console.log(lastExpediente);
    navigate(`/inspect/${id_informe}/edit`);
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

            {formulario === "central" ? (
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
            ) : (
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
          </ul>

          <div className="d-flex align-items-center border-start ps-3">
            <SearchForm formulario={formulario} />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarSGF;
