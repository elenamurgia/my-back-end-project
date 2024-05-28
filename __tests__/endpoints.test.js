const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

describe("GET /api", () => {
  test("200: responds with an accurate JSON object of all available endpoints", async () => {
    const response = await request(app).get("/api").expect(200);
    expect(response.body).toEqual(endpoints);
  });
});
