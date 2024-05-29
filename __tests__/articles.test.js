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
  test.only("200: responds with an object of a single article according to the article_id query ", async () => {
    const response = await request(app).get("/api/articles/9").expect(200);
    const { article } = response.body;
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

describe("GET /api/:article_id", () => {
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
