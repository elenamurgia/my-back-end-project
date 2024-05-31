const {
  selectArticlesById,
  updateArticleById,
  selectArticlesByTopic,
  countAllCommentsByArticleId,
} = require("../models/articles_model");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticlesById(article_id);
    const commentCounter = await countAllCommentsByArticleId(article_id);
    res
      .status(200)
      .send({ article, comment_count: Number(commentCounter.count) });
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

exports.getArticles = async (req, res, next) => {
  try {
    const { topic } = req.query;
    const articles = await selectArticlesByTopic(topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};
