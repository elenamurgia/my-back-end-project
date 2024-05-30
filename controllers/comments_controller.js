const {
  selectCommentsByArticleId,
  insertComment,
  deleteCommentByCommentId,
} = require("../models/comments_model");
const { selectArticlesById } = require("../models/articles_model");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticlesById(article_id);
    if (!article) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    const comments = await selectCommentsByArticleId(article_id);
    return res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.addCommentsForArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  try {
    const newComment = await insertComment(username, body, article_id);
    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const deletedCommentCount = await deleteCommentByCommentId(comment_id);
    if (deletedCommentCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(404).send({ msg: "Not Found" });
    }
    if (typeof deletedCommentCount !== "number") {
      return res.status(400).send({ msg: "Bad Request" });
    }
  } catch (err) {
    next(err);
  }
};
