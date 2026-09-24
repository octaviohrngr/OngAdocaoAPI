import multer from "multer";
import path from "path";
import fs from "fs";

const pastaUploads = path.resolve("uploads");

if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);

    const nomeArquivo =
      `${Date.now()}-${Math.round(Math.random() * 100000)}${extensao}`;

    cb(null, nomeArquivo);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extensoesPermitidas = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const extensao = path
    .extname(file.originalname)
    .toLowerCase();

  if (extensoesPermitidas.includes(extensao)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato inválido. Use JPG, JPEG, PNG ou WEBP."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 2,
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;