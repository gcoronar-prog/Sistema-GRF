import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm({ formulario }) {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

  const buscaInforme = async (id) => {
    const codCentral = "CINF" + id;
    const codInspect = "IPC" + id;
    try {
      const res = await fetch(
        formulario === "usercentral"
          ? `${servidor_local}/search_inform?id=${codCentral}`
          : `${servidor_local}/search_exped?id=${codInspect}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (formulario === "usercentral") {
        if (data.informe.length > 0) {
          navigate(`/informes/central/${id}`);
          setCodigo("");
        } else {
          window.alert("No existen registros con este codigo");
          setCodigo("");
        }
      } else if (formulario === "userinspeccion" || formulario === "userjpl") {
        if (data.expedientes.length > 0) {
          navigate(`/inspect/${codInspect}/edit`);
          setCodigo("");
        } else {
          window.alert("No existen registros con este codigo");
          setCodigo("");
        }
      }

      console.log(formulario, "formulario");

      console.log(codInspect, "inspector");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const id = e.target.value.toUpperCase();

    setCodigo(id);
  };

  return (
    <>
      {(formulario === "usercentral" ||
        formulario === "userinspeccion" ||
        formulario === "userjpl") && (
        <form className="d-flex align-items-center gap-2" role="search">
          <input
            className="form-control form-control-sm"
            id="codigoBusqueda"
            name="codigoBusqueda"
            type="search"
            onChange={handleChanges}
            value={codigo}
            placeholder={
              formulario === "usercentral"
                ? "Código del informe"
                : "Código del expediente"
            }
            aria-label="Buscar"
          />
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => buscaInforme(codigo)}
            type="button"
          >
            <i className="bi bi-search me-1"></i>
            Buscar
          </button>
        </form>
      )}
    </>
  );
}

export default SearchForm;
