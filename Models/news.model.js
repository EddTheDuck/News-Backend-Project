const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id =$1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Request not found!" });
      }
      return rows[0];
    });
};

exports.changeVotes = (votes, id) => {
  if (votes == undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  } else {
    return db
      .query(
        `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;`,
        [votes, id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Request not found!" });
        }
        return rows[0];
      });
  }
};
