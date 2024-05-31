const db = require("../db/connection");

exports.selectArticlesById = async (article_id) => {
  const result = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [article_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result.rows[0];
};

exports.updateArticleById = async (article_id, votesToBeAdded) => {
  const updatedArticle = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
    [votesToBeAdded, article_id]
  );
  if (typeof votesToBeAdded !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (updatedArticle.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return updatedArticle.rows[0];
};

exports.selectArticlesByTopic = async (topic) => {
  let articlesQuery = "SELECT * FROM articles";
  const queryValues = [];

  if (topic) {
    articlesQuery += " WHERE topic = $1";
    queryValues.push(topic);
  }

  const result = await db.query(articlesQuery, queryValues);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result.rows;
};

exports.countAllCommentsByArticleId = async (article_id) => {
  const commentCounter = await db.query(
    "SELECT COUNT(*) as count FROM comments WHERE article_id = $1;",
    [article_id]
  );
  return commentCounter.rows[0];
};
