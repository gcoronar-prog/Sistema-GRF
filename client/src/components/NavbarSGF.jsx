import React from "react";

function NavbarSGF() {
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
                <a className="nav-link" href="/central">
                  Central
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/recursos">
                  Recursos
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/estadocentral">
                  Estado Central
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/centralstats">
                  Estadísticas Central
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarSGF;
