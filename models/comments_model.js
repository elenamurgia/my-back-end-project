const db = require("../db/connection");

exports.selectCommentsByArticleId = async (article_id) => {
  const comments = await db.query(
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
    [article_id]
  );
  //
  return comments.rows;
};

exports.insertComment = async (username, body, article_id) => {
  const usernameQuery = await db.query(
    "SELECT username FROM users WHERE username = $1",
    [username]
  );

  if (usernameQuery.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  const newCommentQuery = await db.query(
    `
      INSERT INTO comments (author, body, article_id)
      VALUES ($1, $2, $3)
      RETURNING comment_id, article_id, body, author AS username;
    `,
    [username, body, article_id]
  );
  return newCommentQuery.rows[0];
};
