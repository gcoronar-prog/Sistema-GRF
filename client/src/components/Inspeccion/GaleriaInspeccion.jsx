import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSGF from "../NavbarSGF";

function GaleriaInspeccion() {
  const [listaImagen, setListaImagen] = useState([]);
  const [imagenActualIndex, setImagenActualIndex] = useState(0);

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const navigate = useNavigate();

  useEffect(() => {
    loadListaImagen();
  }, []);

  const irAAnterior = () => {
    setImagenActualIndex((prev) =>
      prev === 0 ? listaImagen.length - 1 : prev - 1
    );
  };

  const irASiguiente = () => {
    setImagenActualIndex((prev) =>
      prev === listaImagen.length - 1 ? 0 : prev + 1
    );
  };

  const loadListaImagen = async () => {
    try {
      const res = await fetch(`${servidor_local}/listaImagen`);
      const data = await res.json();
      setListaImagen(data.imgExpedientes);
      console.log(data.imgExpedientes);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <NavbarSGF formulario={"inspeccion"} />
      <div className="container text-center mt-4">
        <h4 className="mb-3">Galería de Inspección</h4>
        {listaImagen.length > 0 ? (
          <>
            <div className="card mx-auto" style={{ width: "400px" }}>
              <a
                href={`${servidor_local}/api/galeria/inspect/${listaImagen[imagenActualIndex].id_adjunto}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${servidor_local}/api/galeria/inspect/${listaImagen[imagenActualIndex].id_adjunto}`}
                  className="card-img-top"
                  alt={`imagen-${imagenActualIndex}`}
                  style={{ objectFit: "cover", height: "300px" }}
                />
              </a>
              <div className="card-body">
                <h5 className="card-title">
                  {listaImagen[imagenActualIndex].path_document}
                </h5>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    navigate(
                      `/inspect/${listaImagen[imagenActualIndex].id_expediente}/edit`
                    );
                  }}
                >
                  Ir a expediente
                </button>
                <p className="card-text">
                  Imagen {imagenActualIndex + 1} de {listaImagen.length}
                </p>
              </div>
              <div className="card-footer">
                <label htmlFor="codExpediente" className="form-label">
                  Codigo de expediente
                </label>
                <input
                  name="codExpediente"
                  type="text"
                  className="form-control"
                  placeholder="Ingrese codigo para buscar"
                />
                <br />
                <label htmlFor="numControl" className="form-label">
                  Número de control
                </label>
                <input
                  name="numControl"
                  type="text"
                  className="form-control"
                  placeholder="Ingrese número de control para buscar"
                />
                <br />
              </div>
            </div>

            <div className="mt-3 d-flex justify-content-center gap-2">
              <button className="btn btn-secondary" onClick={irAAnterior}>
                Anterior
              </button>
              <button className="btn btn-secondary" onClick={irASiguiente}>
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <p>Cargando imágenes...</p>
        )}
      </div>
    </>
  );
}

export default GaleriaInspeccion;
