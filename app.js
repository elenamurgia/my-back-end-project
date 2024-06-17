const express = require("express");

const cors = require("cors");

const { getTopics } = require("./controllers/topics_controller");

const { getUsers } = require("./controllers/users_controller");

const { getEndpoints } = require("./controllers/endpoints_controller");

const {
  getArticlesById,
  updateArticle,
  getArticles,
} = require("./controllers/articles_controller");

const {
  getCommentsByArticleId,
  addCommentsForArticleId,
  deleteComment,
} = require("./controllers/comments_controller");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api", getEndpoints);
app.post("/api/articles/:article_id/comments", addCommentsForArticleId);
app.patch("/api/articles/:article_id", updateArticle);
app.delete("/api/comments/:comment_id", deleteComment);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23503" ||
    err.code === "42601" ||
    err.code === "23502" ||
    err.code === "42703" ||
    err.code === "23502"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
