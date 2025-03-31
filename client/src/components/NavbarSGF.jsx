import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavbarSGF() {
  const navigate = useNavigate();
  const handleLastInforme = async () => {
    const res = await fetch("http://localhost:3000/informe/central/last");

    const lastInforme = await res.json();

    const id_informe = lastInforme.informe[0].id_informes_central;

    console.log(lastInforme);
    navigate(`/informes/central/${id_informe}`);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            SGF
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link">Central Municipal</a>
                <ul>
                  <li>
                    <Link
                      onClick={handleLastInforme}
                      //style={{ cursor: "pointer" }}
                    >
                      Informes Central Municipal
                    </Link>
                  </li>
                  <li>
                    <Link to={"/statistics/central/v1"}>
                      Estadísticas Central Municipal
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Inspección Municipal
                </a>
                <ul>
                  <li>
                    <a href="">Expedientes Inspección</a>
                  </li>
                  <li>
                    <a href="">Estadísticas Inspección</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarSGF;
