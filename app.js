const express = require("express");
const res = require("express/lib/response");
const app = express();
const {
  getTopics,
  getArticles,
  patchVotes,
} = require("./Controller/news.controller");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticles);
app.patch("/api/articles/:article_id", patchVotes);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(404).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = { app };
