const { URL } = require("url");
const cheerio = require("cheerio");
const sharp = require("sharp");

const controllerApp = {};

controllerApp.analyse = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Petición incorrecta" });
  }

  try {
    //OBTENEMOS HOST Y PROTOCOLO
    const hostname = new URL(url).hostname;
    const protocol = new URL(url).protocol;

    //OBTEMOS HTML E IMÁGENES
    const resUrl = await fetch(url);
    const html = await resUrl.text();
    const $ = cheerio.load(html);

    if ($("img").length === 0) {
      const error = new Error("No se han encontrado imágenes en esta web");
      return res.status(404).json({
        error: error.message,
      });
    }

    const images = $("img").toArray();
    
    //OBTENEMOS SRC DE LAS IMÁGENES
    let urlsImages = images
      .map((image) => {
        const src = image.attribs.src || image.attribs["data-src"];
        if (src?.startsWith("/")) return protocol + "//" + hostname + src;
        if (src?.startsWith("http")) return src;
        return;
      })
      .filter((src) => src);

    //CONTROL DE ERRORES
    if (urlsImages.length === 0) {
      const error = new Error("Imposible tomar las imágenes en esta web");
      return res.status(404).json({
        error: error.message,
      });
    }

    //ELIMINAR IMÁGENES REPETIDAS
    urlsImages = Array.from(new Set(urlsImages))
    
    //OBTENEMOS LA INFORMACIÓN DE LAS IMÁGENES
    let imagesInfo = await Promise.all(
      urlsImages.map(async (image) => {
        try {
          const res = await fetch(image);
          const buffer = await res.arrayBuffer();
          const info = await sharp(Buffer.from(buffer)).metadata();
          return {
            image,
            size: (info.size / 1000).toFixed(2),
            format: info.format,
            width: info.width,
            height: info.height,
          };
        } catch (error) {
          console.log(error);
          return { image, size: undefined, format: undefined, width: undefined, height: undefined };
        }
      })
    );

     //ELIMINAR IMÁGENES SIN INFORMACIÓN
     imagesInfo = imagesInfo.filter((image)=>image.size)

     //CONTROL DE ERRORES
     if(imagesInfo.length === 0){
      const error = new Error("Imposible analizar las imágenes de esta web");
      return res.status(404).json({
        error: error.message,
      });
     }

    return res.json({ imagesDefault:  imagesInfo });
  } catch (error) {
    console.log(error);
  }
};

controllerApp.optimize = async (req, res) => {
  const {images} = req.body
  if(!images){
    return res.status(400).json({ error: "Petición incorrecta" });
  }

  res.json({message:"ok"})

}

module.exports = controllerApp;
