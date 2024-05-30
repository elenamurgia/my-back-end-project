const {
  selectArticlesById,
  updateArticleById,
} = require("../models/articles_model");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticlesById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { votesToBeAdded } = req.body;
    const updatedArticle = await updateArticleById(article_id, votesToBeAdded);
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};
