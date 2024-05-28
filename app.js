const express = require("express");
const { getTopics } = require("./controllers/topics_controller");
const { getEndpoints } = require("./controllers/endpoints_controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
