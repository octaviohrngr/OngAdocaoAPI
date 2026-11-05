
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const pasta = path.resolve("uploads");

fs.mkdirSync(pasta, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, pasta);
  },
  filename: (_req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${extensao}`);
  },
});

const uploadEvento = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const extensoesPermitidas = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const extensao = path.extname(file.originalname).toLowerCase();

    if (
      !tiposPermitidos.includes(file.mimetype) ||
      !extensoesPermitidas.includes(extensao)
    ) {
      return cb(new Error("Formato de imagem não permitido."));
    }

    cb(null, true);
  },
});

export default uploadEvento;
