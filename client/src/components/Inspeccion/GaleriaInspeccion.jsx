import { useState, useEffect } from "react";

const GaleriaVisual = () => {
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [listImagen, setListImagen] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filtro, setFiltro] = useState({
    rut_contri: "",
    num_control: "",
    id_expediente: "",
  });

  useEffect(() => {
    loadListaImagen();
  }, []);

  const loadListaImagen = async (id) => {
    try {
      const res = await fetch(`${servidor_local}/listaImagen`);
      const data = await res.json();
      setListImagen(data.imgExpedientes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const filtrarImagenes = () => {
    return listImagen.filter((img) => {
      return (
        img.id_expediente?.toLowerCase() ===
          filtro.id_expediente.toLowerCase() ||
        img.num_control?.toLowerCase() === filtro.num_control?.toLowerCase() ||
        img.rut_contri?.toLowerCase() === filtro.rut_contri?.toLowerCase()
      );
    });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Galería de Imágenes</h5>
        <input
          className="form-control mt-2"
          type="text"
          name="id_expediente"
          placeholder="Filtrar por expediente"
          value={filtro.id_expediente}
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
