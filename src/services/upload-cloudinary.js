const cloudinary = require("../helpers/cloudinary-config");

const upload = async (image) => {
  try {
    if (!image.checking) {
      await cloudinary.uploader.upload(image.image, {
        public_id: image.name,
      });
    }
    return { public_id: image.name };
  } catch (error) {
    console.log(error);
    return { error: "Error al subir la imagen" };
  }
};

module.exports = upload;
