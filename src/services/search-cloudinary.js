const cloudinary = require("../helpers/cloudinary-config");

const searchCloudinary = async (public_id) => {
  const res = await cloudinary.search
    .expression(`public_id:${public_id}`)
    .execute();
  if (res.total_count > 0) {
    return true;
  }
  return false;
};

module.exports = searchCloudinary;
