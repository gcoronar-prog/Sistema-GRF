import { useState } from "react";
import NavbarSGF from "../NavbarSGF";
import { useNavigate } from "react-router-dom";

const GaleriaVisual = () => {
  const navigate = useNavigate();
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

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
        `${servidor_local}/listaImagen?id_expe=${id_expe}&rut=${rut}&ppu=${ppu}&num_control=${num_control}`
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
      <NavbarSGF />
      <hr />
      <div className="row">
        <div className="col">
          <div className="align-middle text-center">
            {selectedId && (
              <a
                href={`${servidor_local}/api/galeria/inspect/${selectedId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="img-thumbnail"
                  src={`${servidor_local}/api/galeria/inspect/${selectedId}`}
                  alt={`Imagen con id ${selectedId}`}
                  style={{ width: "500px" }}
                />
              </a>
            )}
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5>Galería de Imágenes</h5>
            </div>

            <div className="card-body">
              <div className="row">
                <div>
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="id_expe"
                    placeholder="Filtrar por expediente"
                    value={filtro.id_expe}
                    onChange={handleChanges}
                  />
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="num_control"
                    placeholder="Filtrar por Número de control"
                    value={filtro.num_control}
                    onChange={handleChanges}
                  />
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="rut_contri"
                    placeholder="Filtrar por RUT contribuyente"
                    value={filtro.rut_contri}
                    onChange={handleChanges}
                  />
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
              <div className="d-flex flex-wrap gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    loadListaImagen(
                      filtro.id_expe,
                      filtro.rut_contri,
                      filtro.ppu,
                      filtro.num_control
                    )
                  }
                >
                  <i className="bi bi-search"></i> Buscar
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5>Listado imágenes</h5>
            </div>
            <div className="card-body">
              <div className="col">
                {listImagen.length > 0 ? (
                  <table className="table table-bordered table-hover">
                    <thead className="table-light align-middle">
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
                                l.id_adjunto === selectedId ? "red" : "black",
                            }}
                          >
                            {" "}
                            {l.path_document}
                          </td>
                          <td>{l.id_expediente}</td>
                          <td className="text-center align-middle">
                            <button
                              className="btn btn-primary"
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
                ) : (
                  <p>No hay imágenes para mostrar.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <br />
      </div>
    </>
  );
};

export default GaleriaVisual;
