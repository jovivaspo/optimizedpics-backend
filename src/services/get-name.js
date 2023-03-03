const { URL } = require("url");

const getName = (url) => {
  const hostname = new URL(url).hostname.replace(".", "");
  const ultimaBarra = url.lastIndexOf("/");
  const nombreArchivoConExtension = url.substring(ultimaBarra + 1);

  // Separar el nombre de archivo y la extensión
  const partes = nombreArchivoConExtension.split(".");
  const nombreArchivo = hostname + "-" + partes[0];

  return nombreArchivo;
};

module.exports = getName;
