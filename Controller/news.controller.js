const {
  fetchTopics,
  fetchArticles,
  changeVotes,
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

exports.getArticles = (req, res, next) => {
  fetchArticles(req.params.article_id)
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
