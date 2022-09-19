const cors = require("cors");
const express = require("express");
const app = express();
const {
  getTopics,
  getArticlesById,
  patchVotes,
  getUsers,
  getArticles,
  getArticleComments,
  postComment,
  deleteCommentbyId,
} = require("./Controller/news.controller");
app.use(cors());

app.use(express.json());

app.get("/api", getAllAPI);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchVotes);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteCommentbyId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42601" || err.code === "42703") {
    res.status(400).send({ msg: "Bad Request!" });
  }
  if (err.code === "23502" || err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
