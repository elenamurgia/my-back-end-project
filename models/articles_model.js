const db = require("../db/connection");

exports.selectArticlesById = async (article_id) => {
  try {
    const result = await db.query(
      "SELECT * FROM articles WHERE article_id = $1;",
      [article_id]
    );

    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return result.rows[0];
  } catch (err) {
    return Promise.reject(err);
  }
};
