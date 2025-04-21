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
        className="navbar  navbar-expand-lg border-bottom border-body"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Inicio
              </a>
            </li>

            {formulario === "central" ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    onClick={handleLastInforme}
                    //style={{ cursor: "pointer" }}
                  >
                    Informes Central Municipal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to={"/statistics/central/v1"}
                  >
                    Estadísticas Central Municipal
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    onClick={handleLastExpediente}
                    //style={{ cursor: "pointer" }}
                  >
                    Expedientes Municipales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to={"/"}>
                    Estadísticas Inspección Municipal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to={"/"}>
                    Galeria de Imágenes
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            <SearchForm formulario={formulario} />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarSGF;
