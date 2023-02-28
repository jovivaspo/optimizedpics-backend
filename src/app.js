const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.set("port", process.env.PORT);

app.use(cors());
app.use(express.json());

app.use("/api/analyse", require("./routes/analyse"));

module.exports = app;
