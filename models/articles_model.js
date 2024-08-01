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

exports.filterArticles = async (
  order = "desc",
  sort_by = "created_at",
  topic,
  limit,
  p,
  total_count = "0"
) => {
  const queryValues = [];
  const acceptableOrders = ["asc", "desc"];
  const acceptableSortBys = [
    "author",
    "title",
    "topic",
    "article_id",
    "comment_count",
    "article_img_url",
    "votes",
    "created_at",
  ];
  const acceptableTotalCounts = ["0", "1"];

  if (!acceptableOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (!acceptableSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (!acceptableTotalCounts.includes(total_count)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let baseSQLString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments)::int AS comment_count`;

  if (total_count === "1") {
    baseSQLString += `, COUNT(*) OVER() AS total_count`;
  }

  baseSQLString += ` FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    baseSQLString += ` WHERE articles.topic = $${queryValues.length + 1}`;
    queryValues.push(topic);
  }

  baseSQLString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  if (limit) {
    baseSQLString += ` LIMIT $${queryValues.length + 1}`;
    queryValues.push(limit);
    if (p) {
      const offset = limit * (p - 1);
      baseSQLString += ` OFFSET $${queryValues.length + 1}`;
      queryValues.push(offset);
    }
  }

  const { rows } = await db.query(baseSQLString, queryValues);
  if (rows.length === 0 && p > 1) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  const returnArray = [rows];
  if (total_count === "1") {
    const totalCount = +rows[0]?.total_count || 0;
    rows.forEach((row) => {
      delete row.total_count;
    });
    returnArray.push(totalCount);
  }
  return returnArray;
};

exports.countAllCommentsByArticleId = async (article_id) => {
  const commentCounter = await db.query(
    "SELECT COUNT(*) as count FROM comments WHERE article_id = $1;",
    [article_id]
  );
  return commentCounter.rows[0];
};

exports.searchArticles = async (searchTerm) => {
  const query = `SELECT * FROM articles WHERE title ILIKE $1 OR body ILIKE $1;`;
  const values = [`%${searchTerm}%`];
  const result = await db.query(query, values);
  return result.rows;
};
