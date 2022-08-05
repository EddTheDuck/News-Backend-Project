const express = require("express");
const res = require("express/lib/response");
const app = express();
const {
  getTopics,
  getArticlesById,
  patchVotes,
  getUsers,
  getArticles,
  getArticleComments,
} = require("./Controller/news.controller");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchVotes);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = { app };
