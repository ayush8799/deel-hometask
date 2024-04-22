const request = require("supertest");
const app = require("../app");

describe("Endpoint: /contracts/:id", () => {
  it("Case: No profileId in headers", async () => {
    const response = await request(app)
      .get("/contracts/1");

    expect(response.statusCode).toBe(401);
  });

  it("Case: Incorrect profileId in headers", async () => {
    const response = await request(app)
      .get("/contracts/1")
      .set({ profile_id: 4 });

    expect(response.statusCode).toBe(403);
  });

  it("Case: Incorrect ContractId in params", async () => {
    const response = await request(app)
      .get("/contracts/132")
      .set({ profile_id: 4 });

    expect(response.statusCode).toBe(400);
  });

  it("Case: Correct input data(ContractId and profile_id)", async () => {
    const response = await request(app)
      .get("/contracts/1")
      .set({ profile_id: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.ClientId).toBe(1);
    expect(response.body.data.id).toBe(1);
  });
});

describe("Endpoint: /contracts", () => {
  it("Case: No profileId in headers", async () => {
    const response = await request(app)
      .get("/contracts");

    expect(response.statusCode).toBe(401);
  });

  it("Case: Incorrect profileId in headers", async () => {
    const response = await request(app)
      .get("/contracts")
      .set({ profile_id: 9 });

    expect(response.statusCode).toBe(204);
  });

  it("Case: Correct profileId in headers", async () => {
    const response = await request(app)
      .get("/contracts")
      .set({ profile_id: 7 });

    expect(response.body.data.length).toBe(3);
    expect(response.statusCode).toBe(200);
  });
});