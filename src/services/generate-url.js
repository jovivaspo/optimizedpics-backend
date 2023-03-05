const cloudinary = require("../helpers/cloudinary-config");
const sharp = require("sharp");

const generateUrl = async (public_id, image) => {
  const originalFormat = image.format;

  const urlsoptimized = {
    webp: {
      url: cloudinary.url(public_id, {
        fetch_format: "webp",
      }),
    },

    avif: {
      url: cloudinary.url(public_id, {
        fetch_format: "avif",
      }),
    },
    [originalFormat]: {
      url: cloudinary.url(public_id, {
        fetch_format: originalFormat,
      }),
    },
    auto: {
      url: cloudinary.url(public_id, {
        fetch_format: "auto",
      }),
    },
  };

  const keys = Object.keys(urlsoptimized);

  const imagesWithSize = await Promise.all(
    keys.map(async (key) => {
      const res = await fetch(urlsoptimized[key].url);
      const buffer = await res.arrayBuffer();
      const info = await sharp(Buffer.from(buffer)).metadata();
      return {
        [key]: {
          url: urlsoptimized[key].url,
          size: (info.size / 1000).toFixed(2),
        },
      };
    })
  );

  return imagesWithSize;
};

module.exports = generateUrl;
