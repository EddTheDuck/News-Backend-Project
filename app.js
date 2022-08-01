const express = require("express");
const app = express();
const { getTopics } = require("./Controller/news.controller");
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Restaurant name cannot be null!" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Must be a number!" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = { app };
