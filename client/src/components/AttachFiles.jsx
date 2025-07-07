import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const AttachFiles = ({ idInforme }) => {
  const params = useParams();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  // Define entityType basado en la ruta
  const entityType = location.pathname.includes("informes")
    ? "informes"
    : location.pathname.includes("inspect")
    ? "inspect"
    : location.pathname.includes("atencion")
    ? "atencion"
    : null;

  const [selectedId, setSelectedId] = useState(null);
  const [listImagen, setListImagen] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setListImagen([]);
    setSelectedId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (idInforme) {
      loadListaImagen(idInforme);
    }
  }, [idInforme]);

  const handleClick = (id) => {
    setSelectedId(id === selectedId ? null : id); // Alterna el color al hacer clic
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `${servidor_local}/api/upload/${entityType}/${idInforme}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        //setUploadStatus("Archivo subido exitosamente: " + file.name);
        setFile(null);
      } else {
        setUploadStatus("Error al subir el archivo.");
      }

      loadListaImagen(idInforme);
    } catch (error) {
      console.error("Error de red:", error);
      setUploadStatus("Error de red al subir el archivo.");
    }
  };

  const handleDeleteFile = async (id) => {
    const confirmar = window.confirm("¿Desea eliminar la imagen?");
    if (!confirmar) return;
    await fetch(`${servidor_local}/api/galeria/${entityType}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "DELETE",
    });
    setListImagen(listImagen.filter((lista) => lista.id_adjunto !== id));
  };

  const loadListaImagen = async (id) => {
    try {
      const res = await fetch(
        `${servidor_local}/api/imagenes/${entityType}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setListImagen(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setUploadStatus("");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header text-bg-success">
              <h5 htmlFor="formFileMultiple" className="h5">
                Adjuntar fotos
              </h5>
            </div>
            <div className="card-body ">
              <input
                className="form-control"
                type="file"
                id="formFileMultiple"
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
              ></input>
              <br />
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={handleFileUpload}
              >
                <i className="bi bi-cloud-arrow-up"></i>
                &nbsp; Subir Archivo
              </button>
              {uploadStatus && <p>{uploadStatus}</p>}
              <br />
              <div>
                {listImagen.length > 0 ? (
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Nombre del archivo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
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
                            {l.path_document}
                          </td>
                          <td className="text-center align-middle">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(l.id_adjunto);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No hay imágenes disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                {selectedId && listImagen ? (
                  <a
                    href={`${servidor_local}/api/galeria/${entityType}/${selectedId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${servidor_local}/api/galeria/${entityType}/${selectedId}`}
                      className="img-thumbnail border border-primary-subtle w-75 h-auto"
                      alt={`ID ${selectedId}`}
                    />
                  </a>
                ) : (
                  <p>Haz clic en una fila para ver la imagen</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*//////////////////////////////////////////////////////////////*/}
    </>
  );
};

export default AttachFiles;
