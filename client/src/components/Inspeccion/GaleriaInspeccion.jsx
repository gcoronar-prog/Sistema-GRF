import { useState } from "react";

import { useNavigate } from "react-router-dom";

const GaleriaVisual = () => {
  const navigate = useNavigate();
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

  const [listImagen, setListImagen] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filtro, setFiltro] = useState({
    id_expe: "",
    rut_contri: "",
    num_control: "",
    ppu: "",
  });

  const loadListaImagen = async (id_expe, rut, ppu, num_control) => {
    try {
      const res = await fetch(
        `${servidor_local}/listaImagen?id_expe=${id_expe}&rut=${rut}&ppu=${ppu}&num_control=${num_control}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setListImagen(data.imgExpedientes || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <hr />
      <div className="row g-4">
        <div className="col-md-6 text-center">
          <div className="align-middle text-center">
            {selectedId && (
              <a
                href={`${servidor_local}/api/galeria/inspect/${selectedId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="img-thumbnail shadow-sm"
                  src={`${servidor_local}/api/galeria/inspect/${selectedId}`}
                  alt={`Imagen con id ${selectedId}`}
                  style={{ maxWidth: "100%", width: "500px" }}
                />
              </a>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Galería de Imágenes</h5>
            </div>

            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-6">
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="id_expe"
                    placeholder="Filtrar por expediente"
                    value={filtro.id_expe}
                    onChange={handleChanges}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="num_control"
                    placeholder="Filtrar por Número de control"
                    value={filtro.num_control}
                    onChange={handleChanges}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="rut_contri"
                    placeholder="Filtrar por RUT contribuyente"
                    value={filtro.rut_contri}
                    onChange={handleChanges}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="ppu"
                    placeholder="Filtrar por PPU"
                    value={filtro.ppu}
                    onChange={handleChanges}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-primary shadow-sm"
                  onClick={() =>
                    loadListaImagen(
                      filtro.id_expe,
                      filtro.rut_contri,
                      filtro.ppu,
                      filtro.num_control
                    )
                  }
                >
                  <i className="bi bi-search me-1"></i> Buscar
                </button>
              </div>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Listado imágenes</h5>
            </div>
            <div className="card-body">
              {listImagen.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered align-middle">
                    <thead className="table-dark text-center">
                      <tr>
                        <th>Nombre del archivo</th>
                        <th className="text-center">Expediente</th>
                        <th className="text-center">Ir a...</th>
                      </tr>
                    </thead>
                    <tbody className="align-middle">
                      {listImagen.map((l) => (
                        <tr
                          key={l.id_adjunto}
                          onClick={() => handleClick(l.id_adjunto)}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <td
                            style={{
                              color:
                                l.id_adjunto === selectedId
                                  ? "#dc3545"
                                  : "inherit",
                            }}
                          >
                            {" "}
                            {l.path_document}
                          </td>
                          <td className="text-center">{l.id_expediente}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                navigate(`/inspect/${l.id_expediente}/edit`)
                              }
                            >
                              <i className="bi bi-arrow-right-square"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay imágenes para mostrar.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <br />
    </>
  );
};

export default GaleriaVisual;
