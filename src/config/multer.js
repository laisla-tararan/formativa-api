const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    /*
            Pega data/hora atual
        */
    const time = new Date().getTime();

    /*
            Remove espaços do nome
        */
    const nomeOriginal = file.originalname.replace(/\s+/g, "-");

    /*
            Nome final
        */
    const nomeArquivo = `${time}-${nomeOriginal}`;

    callback(null, nomeArquivo);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const tiposPermitidos = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Tipo de arquivo inválido"));
    }
  },
});

module.exports = upload;