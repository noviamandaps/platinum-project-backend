import request from "supertest";
import app from "../../app";

describe("POST /v1/api/login", () => {
  it("should response with 201 as status code", async () => {
    const email = "admin@gmail.com";
    const password = "123456";

    return request(app)
      .post("/v1/api/login")
      .set("Content-Type", "application/json")
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            accessToken: expect.any(String),
          })
        );
      });
  });

  // it("should response with 404 as status code", async () => {
  //   return request(app)
  //     .post("/v1/api/login")
  //     .send({
  //       email: wrongEmail,
  //       password,
  //     })
  //     .then((res) => {
  //       expect(res.statusCode).toBe(404);
  //       expect(res.body).toBe({
  //         status: expect.any(String),
  //         msg: expect.any(String),
  //       });
  //     });
  // });

  // it("should response with 401 as status code", async () => {
  //   return request(app)
  //     .post("/v1/auth/login")
  //     .send({
  //       email,
  //       password: wrongPassword,
  //     })
  //     .then((res) => {
  //       expect(res.statusCode).toBe(400);
  //       expect(res.body).toEqual({
  //         status: expect.any(Boolean),
  //         msg: expect.any(String),
  //       });
  //     });
  // });
});
