const express = require("express");
const { getTopics } = require("./controllers/topics_controller");
const { getEndpoints } = require("./controllers/endpoints_controller");
const { getArticlesById } = require("./controllers/articles_controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api", getEndpoints);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
