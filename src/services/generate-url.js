const cloudinary = require("../helpers/cloudinary-config");
const generateUrl = (public_id) => {
  const url = cloudinary.url(public_id, {
    fetch_format: "auto",
  });

  return url;
};

module.exports = generateUrl;
