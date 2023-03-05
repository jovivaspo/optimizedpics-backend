const { URL } = require("url");

const getName = (url) => {
  let hostname = new URL(url).hostname;

  const ultimaBarra = url.lastIndexOf("/");
  const nombreArchivoConExtension = url.substring(ultimaBarra + 1);

  // Separar el nombre de archivo y la extensión
  const partes = nombreArchivoConExtension.split(".");
  const nombreArchivo = (hostname + "-" + partes[0])
    .replaceAll(".", "")
    .replaceAll("%20", "-")
    .replace(/[^a-zA-Z0-9]+/g, "");

  return nombreArchivo;
};

module.exports = getName;
