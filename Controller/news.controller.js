const {
  fetchTopics,
  fetchArticlesById,
  changeVotes,
  fetchUsers,
  fetchArticles,
  fetchArticleComments,
  postArticleComment,
} = require("../Models/news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  fetchArticlesById(req.params.article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const articles_id = req.params.article_id;
  const votes = req.body.votes;
  changeVotes(votes, articles_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sortby, orderby, topic } = req.query;

  console.log(req.query);
  fetchArticles(sortby, orderby, topic).then((articles) => {
    res.send({ articles });
  });
};

exports.getArticleComments = (req, res, next) => {
  fetchArticleComments(req.params.article_id)
    .then((comments) => {
      res.send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  postArticleComment(req.params.article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
