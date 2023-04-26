import request from "supertest";
import app from "../../app";

const departureAirport = 1;
const arrivalAirport = 2;
const departureDate = "2022-09-30";
const arrivalDate = "2022-10-02";
const departureTime = "23:05:59";
const arrivalTime = "07:09:20";
const planeId = 1;

describe("POST /v1/create", () => {
  it("should response with 201 as status code", async () => {
    let accessToken = await request(app)
      .post("/v1/api/login")
      .send({ email: "admin@gmail.com", password: "123456" });

    return request(app)
      .post("/v1/api/flight/create")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken.body.accessToken}`)
      .send({
        departureAirport,
        arrivalAirport,
        departureDate,
        arrivalDate,
        departureTime,
        arrivalTime,
        planeId,
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
          departureAirport: expect.any(Number),
          arrivalAirport: expect.any(Number),
          departureDate: expect.any(String),
          arrivalDate: expect.any(String),
          departureTime: expect.any(String),
          arrivalTime: expect.any(String),
          planeId: expect.any(Number),
        });
      });
  });

  //   it("should response with 401 as status code", async () => {
  //     const accessToken = await request(app).post("/v1/auth/login").send({
  //       email: "customer@gmail.com",
  //       password: "123",
  //     });

  //     return request(app)
  //       .post("/v1/cars")
  //       .set("Content-Type", "application/json")
  //       .set("Authorization", `Bearer ${accessToken.body.accessToken}`)
  //       .send({ name, price, size, image })
  //       .then((res) => {
  //         expect(res.status).toBe(401);
  //         if (res.body.details === null) {
  //           expect(res.body).toEqual({
  //             error: expect.objectContaining({
  //               name: expect.any(String),
  //               message: expect.any(String),
  //               details: null,
  //             }),
  //           });
  //           return;
  //         }
  //         expect(res.body).toEqual({
  //           error: expect.objectContaining({
  //             name: expect.any(String),
  //             message: expect.any(String),
  //             details: expect.objectContaining({
  //               role: expect.any(String),
  //               reason: expect.any(String),
  //             }),
  //           }),
  //         });
  //       });
  //   });

  // afterAll(async () => {
  //   const accessToken = await request(app).post("/v1/api/login").send({
  //     email: "admin@gmail.com",
  //     password: "123456",
  //   });

  //   return request(app)
  //     .delete("/v1/api/flight/delete/" + flight.id)
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${accessToken}`);
  // });
});
