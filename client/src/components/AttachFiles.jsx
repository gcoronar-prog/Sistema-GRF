import CloudUpload from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const AttachFiles = () => {
  const params = useParams();
  const location = useLocation();

  // Define entityType basado en la ruta
  const entityType = location.pathname.includes("reports")
    ? "reports"
    : location.pathname.includes("inspect")
    ? "inspect"
    : location.pathname.includes("atencion")
    ? "atencion"
    : null;

  const [selectedId, setSelectedId] = useState(null);
  const [listImagen, setListImagen] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    loadListaImagen(params.id);
  }, [params.id]);

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
        `http://localhost:3000/api/upload/${entityType}/${params.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Archivo subido exitosamente: " + file.name);
        setFile(null);
      } else {
        setUploadStatus("Error al subir el archivo.");
      }

      loadListaImagen(params.id);
    } catch (error) {
      console.error("Error de red:", error);
      setUploadStatus("Error de red al subir el archivo.");
    }
  };

  const handleDeleteFile = async (id) => {
    await fetch(`http://localhost:3000/api/galeria/${entityType}/${id}`, {
      method: "DELETE",
    });
    setListImagen(listImagen.filter((lista) => lista.id_adjunto !== id));
  };

  const loadListaImagen = async (id) => {
    const res = await fetch(
      `http://localhost:3000/api/imagenes/${entityType}/${id}`
    );
    const data = await res.json();
    setListImagen(data);
    console.log(data);
  };

  const handleFileRemove = () => {
    setFile(null);
    setUploadStatus("");
  };

  return (
    <div style={{ margin: "20px" }}>
      <Typography variant="h5">Subir Archivo</Typography>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<FormatListBulletedIcon />}
        >
          Seleccionar Archivo
        </Button>
      </label>
      {file && (
        <div>
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            Archivo seleccionado: {file.name}
          </Typography>
          <IconButton
            variant="outlined"
            color="error"
            onClick={handleFileRemove}
            style={{ marginLeft: "10px" }}
          >
            <CancelIcon />
          </IconButton>
        </div>
      )}
      <Button
        variant="contained"
        color="success"
        onClick={handleFileUpload}
        startIcon={<CloudUpload />}
        style={{ marginLeft: "10px" }}
      >
        Subir Archivo
      </Button>
      {uploadStatus && <Typography>{uploadStatus}</Typography>}

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

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(l.id_adjunto);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No hay imágenes disponibles.
          </Typography>
        )}
      </div>

      {selectedId ? (
        <a
          href={`http://localhost:3000/api/galeria/${entityType}/${selectedId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`http://localhost:3000/api/galeria/${entityType}/${selectedId}`}
            alt={`Imagen con id ${selectedId}`}
            style={{ width: "200px" }}
          />
        </a>
      ) : (
        <p>Haz clic en una fila para ver la imagen</p>
      )}
    </div>
  );
};

export default AttachFiles;
