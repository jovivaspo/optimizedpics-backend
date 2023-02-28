const controllerApp = {};

controllerApp.analyse = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Petición incorrecta" });
  }
  return res.json({ message: url });
};

module.exports = controllerApp;
