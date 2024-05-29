const { selectArticlesById } = require("../models/articles_model");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticlesById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
