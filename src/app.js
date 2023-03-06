const express = require("express");
const path = require("path")
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.set("port", process.env.PORT);

//app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use("/api", require("./routes/api"));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'), function(err) {
     if (err) {
       res.status(500).send(err)
     }
   })
   })


module.exports = app;
