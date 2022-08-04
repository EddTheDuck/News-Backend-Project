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

describe("GET /api/articles/:article_id", () => {
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

describe("GET /api/articles", () => {
  test("Respond with status 200: and an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Check that they are ordered in descending order by created_at", () => {
    const objectOne = {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: "2020-11-03T09:12:00.000Z",
      votes: 0,
      comment_count: 2,
    };
    const objectTwo = {
      article_id: 6,
      title: "A",
      topic: "mitch",
      author: "icellusedkars",
      body: "Delicious tin of cat food",
      created_at: "2020-10-18T01:00:00.000Z",
      votes: 0,
      comment_count: 1,
    };
    const objectLast = {
      article_id: 7,
      title: "Z",
      topic: "mitch",
      author: "icellusedkars",
      body: "I was hungry.",
      created_at: "2020-01-07T14:08:00.000Z",
      votes: 0,
      comment_count: 0,
    };
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0]).toEqual(objectOne);
        expect(articles[1]).toEqual(objectTwo);
        expect(articles[articles.length - 1]).toEqual(objectLast);
      });
  });
});
