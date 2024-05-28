const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/topics", () => {
  test("200: responds with an array of topics", async () => {
    const response = await request(app).get("/api/topics").expect(200);
    const { topics } = response.body;
    expect(topics).toHaveLength(3);
    topics.forEach((topic) => {
      expect(topic).toMatchObject({
        description: expect.any(String),
        slug: expect.any(String),
      });
    });
  });

  describe("GET /api/somethingelse", () => {
    test("404: responds with 404 error message if the endpoint is not valid", async () => {
      const response = await request(app).get("/api/somethingelse").expect(404);
      expect(response.body.msg).toBe("Endpoint not found");
    });
  });
});
