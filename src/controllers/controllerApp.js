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
    const hostname = new URL(url).hostname;
    const protocol = new URL(url).protocol;

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

    const urlsImages = images
      .map((image) => {
        const src = image.attribs.src || image.attribs["data-src"];
        if (src?.startsWith("/")) return protocol + "//" + hostname + src;
        if (src?.startsWith("http")) return src;
        return;
      })
      .filter((src) => src);

    if (urlsImages.length === 0) {
      const error = new Error("Imposible tomar las imágenes en esta web");
      return res.status(404).json({
        error: error.message,
      });
    }

    const imagesSizes = await Promise.all(
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
          return { image, size: undefined, timeLoad: undefined };
        }
      })
    );

    console.log(imagesSizes);

    return res.json({ imagesDefault: imagesSizes });
  } catch (error) {
    console.log(error);
  }
};

module.exports = controllerApp;
