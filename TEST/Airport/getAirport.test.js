import request from "supertest";
import app from "../../app";

describe("GET /v1/api/airports", () => {
  it("should response with 200 as status code", async () => {
    return await request(app)
      .get("/v1/api/airports")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(response.body);
      });
  });

  it("should response with 200 as status code get by id", async () => {
    const id = 1;
    return await request(app)
      .get("/v1/api/airports/byid/" + id)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(response.body);
      });
  });

  it("should response with 200 as status code get by Search", async () => {
    const search = "abakan";
    return await request(app)
      .get("/v1/api/airports/" + search)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(response.body);
      });
  });
});
