const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.set("port", process.env.PORT);

app.use(helmet());
app.use(cors());

app.use(express.static("public"));

app.use("/api", require("./routes/api"));

module.exports = app;
