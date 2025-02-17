import express from "express";
import morgan from "morgan";
import centralRoutes from "./routes/central.routes.js";

import inspectRoutes from "./routes/inspect.routes.js";
import alfaGRDRoutes from "./routes/alfaGRD.routes.js";
import inventarioRoutes from "./routes/inventarioGRD.routes.js";
import solicitudImagenesRoutes from "./routes/imagenes.routes.js";
import atencionSGC from "./routes/atencionSGC.routes.js";
import loginUser from "./routes/login.routes.js";

import informesCentral from "./routes/informes.routes.js";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import path from "path";
import multer from "multer";
import {
  createArchivo,
  deleteArchivo,
  findArchivos,
  findArchivosById,
} from "./controllers/informes.controller.js";

import { fileURLToPath } from "url";
import {
  createArchivoExp,
  deleteArchivoExp,
  findArchivosByIdExp,
  findArchivosExp,
} from "./controllers/inspect.controller.js";

import {
  getArchivosAten,
  findArchivosAten,
  findArchivosByIdAten,
  createArchivoAten,
  deleteArchivoAten,
} from "./controllers/atencionSGC.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  centralRoutes,
  inspectRoutes,
  alfaGRDRoutes,
  inventarioRoutes,
  solicitudImagenesRoutes,
  atencionSGC,
  informesCentral,
  loginUser
);

app.post(
  "/api/upload/:entityType/:id",
  upload.single("image"),
  async (req, res) => {
    const { entityType, id } = req.params;

    // Registro del valor de entityType
    console.log("Entity Type recibido:", entityType);

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha proporcionado una imagen" });
    }

    const fileUrl = req.file.filename;

    try {
      let result;

      switch (entityType) {
        case "informes":
          console.log("Procesando para: informes");
          result = await createArchivo(fileUrl, id);
          break;
        case "inspect":
          console.log("Procesando para: inspect");
          result = await createArchivoExp(fileUrl, id);
          break;
        case "atencion":
          console.log("Procesando para: atencion");
          result = await createArchivoAten(fileUrl, "SGC" + id);
          break;
        default:
          console.log("Tipo de entidad no válido:", entityType);
          return res.status(400).json({ message: "Tipo de entidad no válido" });
      }

      res.json({
        message: "Archivo subido con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).json({
        message: "Error al subir el archivo",
        error: error.message,
      });
    }
  }
);

app.get("/api/imagenes/:entityType/:id", async (req, res) => {
  const { entityType, id } = req.params;
  console.log(`Buscando imágenes con ID: ${id}`);
  try {
    if (entityType === "informes") {
      const images = await findArchivos(id); // Asegúrate de implementar esta función
      /* if (!images.length) {
        return res.status(404).json({ msg: "No se encontraron imágenes" });
        }*/

      // Retornar la lista de imágenes.
      res.json(images);
    } else if (entityType === "inspect") {
      const images = await findArchivosExp(id);
      res.json(images);
    } else if (entityType === "atencion") {
      const images = await findArchivosAten(id);
      res.json(images);
    }
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

app.get("/api/galeria/:entityType/:id", async (req, res) => {
  const { entityType, id } = req.params;
  console.log(`Buscando imágenes con ID: ${id}`);
  try {
    if (entityType === "informes") {
      const images = await findArchivosById(id); // Asegúrate de implementar esta función
      if (!images.length) {
        return res.status(404).json({ msg: "No se encontraron imágenes" });
      }

      const image = images[0];
      const imagePath = path.join(__dirname, "../uploads", image.path_document);
      res.sendFile(imagePath);
    } else if (entityType === "inspect") {
      const images = await findArchivosByIdExp(id); // Asegúrate de implementar esta función
      if (!images.length) {
        return res.status(404).json({ msg: "No se encontraron imágenes" });
      }

      const image = images[0];
      const imagePath = path.join(__dirname, "../uploads", image.path_document);
      res.sendFile(imagePath);
    } else if (entityType === "atencion") {
      const images = await findArchivosByIdAten(id); // Asegúrate de implementar esta función
      if (!images.length) {
        return res.status(404).json({ msg: "No se encontraron imágenes" });
      }

      const image = images[0];
      const imagePath = path.join(__dirname, "../uploads", image.path_document);
      res.sendFile(imagePath);
    }
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

app.delete("/api/galeria/:entityType/:id", deleteArchivo);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Conectado al puerto ${PORT}`);
});
/*app.listen(3001);
console.log("conectado a puerto 3001");*/
