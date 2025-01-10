const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const urlRoutes = require("./routes/url.routes");
const errorHandler = require("./utils/errorMiddleware");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", urlRoutes);

app.use(express.static(path.join(__dirname, "views", "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dist", "index.html"));
});

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorHandler);

module.exports = app;
