import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";

function NavbarSGF({ central }) {
  const navigate = useNavigate();
  const handleLastInforme = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_ROUTE_BACK}/informe/central/last`
    );

    const lastInforme = await res.json();

    const id_informe = lastInforme.informe[0].id_informes_central;

    console.log(lastInforme);
    navigate(`/informes/central/${id_informe}`);
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

            {central === "central" ? (
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
                <a className="nav-link" href="/">
                  Inspección Municipal
                </a>

                <a className="nav-link active" href="">
                  Expedientes Inspección
                </a>

                <a className="nav-link active" href="">
                  Estadísticas Inspección
                </a>
              </>
            )}
          </ul>
          <div className="d-flex">
            <SearchForm central={"central"} />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarSGF;
