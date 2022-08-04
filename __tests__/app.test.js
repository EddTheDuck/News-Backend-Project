const { app } = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const users = require("../db/data/test-data/users");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("Respond with status 200: and an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe.only("GET /api/articles/:article_id", () => {
  test("respond with a status 200: and an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
      });
  });
  test("returns a 404 when Request not found", () => {
    return request(app)
      .get("/api/articles/69")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Request not found!");
      });
  });
  test("returns a 400 when invalid request", () => {
    return request(app)
      .get("/api/articles/rhubarb")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("returns a 200 and comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toEqual(11);
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("update votes of a selected article", () => {
    const incVotes = {
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(102);
      });
  });
  test("returns a 404 when Request not found", () => {
    const incVotes = {
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/69")
      .send(incVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Request not found!");
      });
  });
  test("returns a 400 when invalid request", () => {
    return request(app)
      .get("/api/articles/rhubarb")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("returns 400 when sent an incorrect data type that still has the correct key", () => {
    const incVotes = {
      votes: "fish",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("returns 400 when sent an incorrect data type", () => {
    const incVotes = "fish";
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
});

describe("GET /api/users", () => {
  test("Respond with status 200: and an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

// FEATURE REQUEST
// An article response object should also now include:

// -comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

//needs a new column called comment_count - in the comment.js file it needs to count the number of comments that are for a particular article_id

// SELECT animals.*, COUNT(northcoder_id)
// FROM animals
