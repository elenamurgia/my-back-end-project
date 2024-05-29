const db = require("../db/connection");

exports.selectCommentsByArticleId = async (article_id) => {
  try {
    const comments = await db.query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    );
    if (comments.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return comments.rows;
  } catch (err) {
    return Promise.reject(err);
  }
};
