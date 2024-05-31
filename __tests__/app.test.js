const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/topics", () => {
  test("200: responds with an object with all topics", async () => {
    const response = await request(app).get("/api/topics").expect(200);
    const { topics } = response.body;
    expect(topics).toHaveLength(3);
    topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });

  test("404: responds with 404 error message if the endpoint is not valid", async () => {
    const response = await request(app).get("/api/somethingelse").expect(404);
    expect(response.body.msg).toBe("Endpoint Not Found");
  });
});

describe("GET /api", () => {
  test("200: responds with an accurate JSON object of all available endpoints", async () => {
    const response = await request(app).get("/api").expect(200);
    expect(response.body).toEqual(endpoints);
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an object of a single article according to the article_id query", async () => {
    const response = await request(app).get("/api/articles/9").expect(200);
    const { article } = response.body;
    expect(article).toMatchObject({
      article_id: 9,
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
    });
  });

  test("404: responds with 404 error message if the article_id does not exist", async () => {
    const response = await request(app).get("/api/articles/1000").expect(404);
    expect(response.body.msg).toBe("Not Found");
  });

  test("400: responds with 400 error message if the article_id is an invalid data type", async () => {
    const response = await request(app)
      .get("/api/articles/invalid")
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with the comments relating to a single article_id", async () => {
    const response = await request(app)
      .get("/api/articles/9/comments")
      .expect(200);
    const { comments } = response.body;
    expect(comments).toHaveLength(2);
    comments.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        article_id: 9,
      });
    });
  });

  test("200: sorts the comments in descending order from when they are created", async () => {
    const response = await request(app)
      .get("/api/articles/9/comments")
      .expect(200);
    const { comments } = response.body;
    expect(comments).toHaveLength(2);
    expect(comments).toBeSortedBy("created_at", { descending: true });
  });

  test("200: responds with an empty array if the article_id has no comments", async () => {
    const response = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(response.body.comments).toEqual([]);
  });

  test("404: responds with 404 error message if the article_id does not exist", async () => {
    const response = await request(app)
      .get("/api/articles/1000/comments")
      .expect(404);
    expect(response.body.msg).toBe("Not Found");
  });

  test("400: responds with 400 error message if the article_id is an invalid data type", async () => {
    const response = await request(app)
      .get("/api/articles/invalid/comments")
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: posts a new comment to a given article_id", async () => {
    const newComment = {
      username: "butter_bridge",
      body: "Brilliant article!",
    };
    const response = await request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201);
    const { comment } = response.body;
    expect(comment).toMatchObject({
      comment_id: expect.any(Number),
      body: "Brilliant article!",
      username: "butter_bridge",
      article_id: 9,
    });
  });

  test("400: responds with 400 error message if the body of the comment is missing", async () => {
    const response = await request(app)
      .post("/api/articles/9/comments")
      .send({ username: "butter_bridge" })
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });

  test("404: responds with 404 error message if username does not exist", async () => {
    const response = await request(app)
      .post("/api/articles/9/comments")
      .send({
        username: "not_an_username",
        body: "Brilliant article!",
      })
      .expect(404);
    expect(response.body.msg).toBe("Not Found");
  });

  test("404: responds with 404 error message if the article_id does not exist", async () => {
    const response = await request(app)
      .get("/api/articles/1000/comments")
      .send({ username: "butter_bridge" })
      .expect(404);
    expect(response.body.msg).toBe("Not Found");
  });

  test("400: responds with 400 error code if article_id is invalid", async () => {
    const response = await request(app)
      .post("/api/articles/invalid_id/comments")
      .send({ username: "butter_bridge", body: "Brilliant article!" })
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with an object of the articles with the updated votes", async () => {
    const response = await request(app)
      .patch("/api/articles/1")
      .send({ votesToBeAdded: 1 })
      .expect(200);
    const { article } = response.body;
    expect(article).toMatchObject({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 101,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });

  test("200: responds with an object of the articles with the updated votes when the article doesn't have any vote yet", async () => {
    const response = await request(app)
      .patch("/api/articles/9")
      .send({ votesToBeAdded: 10 })
      .expect(200);
    const { article } = response.body;
    expect(article).toMatchObject({
      article_id: 9,
      title: "They're not exactly dogs, are they?",
      topic: "mitch",
      author: "butter_bridge",
      body: "Well? Think about it.",
      created_at: "2020-06-06T09:10:00.000Z",
      votes: 10,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });

  test("400: responds with a 400 error if votesToBeAdded is not a number", async () => {
    const response = await request(app)
      .patch("/api/articles/1")
      .send({ votesToBeAdded: "hello" })
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });

  test("400: responds with a 400 error if article_id is not a number", async () => {
    const response = await request(app)
      .patch("/api/articles/not_a_number")
      .send({ votesToBeAdded: 10 })
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });

  test("404: responds with a 404 error if the article_id does not exist", async () => {
    const response = await request(app)
      .patch("/api/articles/1000")
      .send({ votesToBeAdded: 20 })
      .expect(404);
    expect(response.body.msg).toBe("Not Found");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete the proper comment and respond with status 204", async () => {
    const response = await request(app).delete("/api/comments/1").expect(204);
    expect(response.statusCode).toBe(204);
  });

  test("404: should responds with 404 error message if comment_id does not exist", async () => {
    const response = await request(app)
      .delete("/api/comments/100000")
      .expect(404);
    expect(response.body.msg).toBe("Not Found");
  });
  test("400: responds with 400 error message if the comment_id is not a number", async () => {
    const response = await request(app)
      .delete("/api/comments/'hello")
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("GET /api/users", () => {
  test("200: responds with an object with all users", async () => {
    const response = await request(app).get("/api/users").expect(200);
    const { users } = response.body;
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });

  test("404: responds with 404 error message if the endpoint is not valid", async () => {
    const response = await request(app).get("/api/somethingelse").expect(404);
    expect(response.body.msg).toBe("Endpoint Not Found");
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of all articles", async () => {
    const response = await request(app).get("/api/articles").expect(200);
    const { articles } = response.body;
    expect(articles).toHaveLength(13);
    articles.forEach((article) => {
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      });
    });
  });

  test("200: responds with all articles for a given topic", async () => {
    const response = await request(app)
      .get("/api/articles?topic=mitch")
      .expect(200);
    const { articles } = response.body;
    expect(articles).toHaveLength(12);
    articles.forEach((article) => {
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: "mitch",
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      });
    });
  });
  test("200: responds with the topic name for a given topic", async () => {
    const response = await request(app)
      .get("/api/articles?topic=cats")
      .expect(200);
    const { articles } = response.body;
    expect(articles).toHaveLength(1);
    articles.forEach((article) => {
      expect(article.topic).toBe("cats");
    });
  });

  test("404: responds with 404 error message if there are no articles with the given topic", async () => {
    const response = await request(app)
      .get("/api/articles?topic=dogs")
      .expect(404);
    expect(response.body.msg).toBe("Not Found");
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: responds with the article_id and the number of comments with the specified article_id", async () => {
    const response = await request(app).get("/api/articles/9").expect(200);
    const { article, comment_count } = response.body;
    expect(article.article_id).toBe(9);
    expect(comment_count).toBe(2);
  });

  test("200: responds with the article_id and zero comment count when there are no comments", async () => {
    const response = await request(app).get("/api/articles/2").expect(200);
    const { article, comment_count } = response.body;
    expect(article.article_id).toBe(2);
    expect(comment_count).toBe(0);
  });

  test("400: responds with a 400 error if the article_id is an invalid data type", async () => {
    const response = await request(app)
      .get("/api/articles/not_a_number")
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });

  test("404: responds with a 404 error if the article_id is a valid data type but does not exist", async () => {
    const response = await request(app).get("/api/articles/9999").expect(404);
    expect(response.body.msg).toBe("Not Found");
  });
});
