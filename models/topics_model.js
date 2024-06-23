const db = require("../db/connection");

exports.fetchTopics = async () => {
  const result = await db.query(`SELECT * FROM topics;`);
  return result.rows;
};

exports.checkTopicExists = async (topic) => {
  const { rows } = await db.query(`SELECT slug FROM topics`);
  if (rows.every((row) => row.slug !== topic)) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
};
