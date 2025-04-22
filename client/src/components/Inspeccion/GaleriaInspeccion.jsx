import { useState, useEffect } from "react";

const GaleriaVisual = ({ idInforme }) => {
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [listImagen, setListImagen] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    if (idInforme) {
      loadListaImagen(idInforme);
    }
  }, [idInforme]);

  const loadListaImagen = async (id) => {
    try {
      const res = await fetch(`${servidor_local}/api/imagenes/inspect/${id}`);
      const data = await res.json();
      setListImagen(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const filtrarImagenes = () => {
    return listImagen.filter((img) =>
      img.id_expediente.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Galería de Imágenes</h5>
        <input
          className="form-control mt-2"
          type="text"
          placeholder="Filtrar por expediente"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="card-body">
        {filtrarImagenes().length > 0 ? (
          <ul>
            {filtrarImagenes().map((l) => (
              <li
                key={l.id_adjunto}
                onClick={() => handleClick(l.id_adjunto)}
                style={{
                  cursor: "pointer",
                  color: l.id_adjunto === selectedId ? "red" : "black",
                }}
              >
                {l.path_document}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay imágenes para mostrar.</p>
        )}

        {selectedId && (
          <a
            href={`${servidor_local}/api/galeria/inspect/${selectedId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`${servidor_local}/api/galeria/inspect/${selectedId}`}
              alt={`Imagen con id ${selectedId}`}
              style={{ width: "200px" }}
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default GaleriaVisual;
