const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an object of a single article according to the article_id query ", async () => {
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
});

describe("GET /api/articles/:article_id, errors", () => {
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
});

describe("PATCH /api/articles/:article_id, errors", () => {
  test("400: responds with a 400 error if votesToBeAdded is not a number", async () => {
    const response = await request(app)
      .patch("/api/articles/1")
      .send({ votesToBeAdded: "hello" })
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
