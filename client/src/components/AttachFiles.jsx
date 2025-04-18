import CloudUpload from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const AttachFiles = ({ idInforme }) => {
  const params = useParams();
  const location = useLocation();

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
        `${
          import.meta.env.VITE_SERVER_ROUTE_BACK
        }/api/upload/${entityType}/${idInforme}`,
        {
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
    await fetch(
      `${
        import.meta.env.VITE_SERVER_ROUTE_BACK
      }/api/galeria/${entityType}/${id}`,
      {
        method: "DELETE",
      }
    );
    setListImagen(listImagen.filter((lista) => lista.id_adjunto !== id));
  };

  const loadListaImagen = async (id) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_ROUTE_BACK
        }/api/imagenes/${entityType}/${id}`
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
      <div className="card">
        <div className="card-header">
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
            <i
              className="bi bi-cloud-arrow-up"
              style={{ fontSize: "2rem" }}
            ></i>{" "}
            &nbsp; Subir Archivo
          </button>
          {uploadStatus && <p>{uploadStatus}</p>}

          <div>
            {listImagen.length > 0 ? (
              <ul>
                {listImagen.map((l) => (
                  <li
                    key={l.id_adjunto}
                    onClick={() => handleClick(l.id_adjunto)}
                    style={{
                      color: l.id_adjunto === selectedId ? "red" : "black", // Cambia el color si el ID está seleccionado
                      cursor: "pointer", // Cambia el cursor al pasar sobre el texto
                    }}
                  >
                    {l.path_document}
                    <button className="btn">
                      <i
                        className="bi bi-trash"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(l.id_adjunto);
                        }}
                      ></i>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay imágenes disponibles.</p>
            )}
          </div>

          {selectedId && listImagen ? (
            <a
              href={`${
                import.meta.env.VITE_SERVER_ROUTE_BACK
              }/api/galeria/${entityType}/${selectedId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`${
                  import.meta.env.VITE_SERVER_ROUTE_BACK
                }/api/galeria/${entityType}/${selectedId}`}
                alt={`Imagen con id ${selectedId}`}
                style={{ width: "200px" }}
              />
            </a>
          ) : (
            <p>Haz clic en una fila para ver la imagen</p>
          )}
        </div>
      </div>

      {/*//////////////////////////////////////////////////////////////*/}
    </>
  );
};

export default AttachFiles;
