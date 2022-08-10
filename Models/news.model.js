const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticlesById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ;`,
      [id]
    )
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

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = (
  sortby = "created_at",
  orderby = "DESC",
  topic = "all"
) => {
  let baseSql = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const queryValues = [];
  if (topic !== "all") {
    queryValues.push(topic);
    baseSql += ` WHERE articles.topic = $1`;
  }
  baseSql += ` GROUP BY articles.article_id ORDER BY ${sortby} ${orderby}`;
  console.log(baseSql);
  return db.query(baseSql, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleComments = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Request not found!" });
      } else {
        return db
          .query(`SELECT * FROM comments WHERE article_id =$1`, [id])
          .then(({ rows }) => {
            return rows;
          });
      }
    });
};

exports.postArticleComment = (article_id, comment) => {
  if (comment.body === undefined || comment.username === undefined) {
    return Promise.reject({ status: 400 });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) returning *;`,
      [article_id, comment.username, comment.body]
    )
    .then(({ rows: comment }) => {
      return comment;
    });
};
