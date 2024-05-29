const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments relating to a single article_id", async () => {
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
});

describe("GET /api/:article_id/comments", () => {
  test("404: responds with 404 error message if the article_id does not exist", async () => {
    const response = await request(app)
      .get("/api/articles/1000/comments")
      .expect(404);
    expect(response.body.msg).toBe("Not Found");
  });
  test("404: responds with 404 error message if the article_id has no comments", async () => {
    const response = await request(app)
      .get("/api/articles/2/comments")
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
