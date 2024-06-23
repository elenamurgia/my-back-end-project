const {
  selectArticlesById,
  updateArticleById,
  filterArticles,
  countAllCommentsByArticleId,
} = require("../models/articles_model");

const { checkTopicExists } = require("../models/topics_model");

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
  const { topic, sort_by, order, limit, p, total_count } = req.query;
  const promises = [
    filterArticles(order, sort_by, topic, limit, p, total_count),
  ];
  if (topic) {
    promises.push(checkTopicExists(topic));
  }
  try {
    const resolvedPromises = await Promise.all(promises);
    const articles = resolvedPromises[0][0];
    const responseBody = { articles };
    if (total_count) {
      responseBody.total_count = resolvedPromises[0][1];
    }
    res.status(200).send(responseBody);
  } catch (err) {
    next(err);
  }
};
