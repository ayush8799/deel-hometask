const request = require("supertest");
const app = require("../app");

describe("Endpoint: /admin/best-profession?start=<startDate>&end=<endDate>", () => {
  it("Case: Date Range: 5-8-20 to 14-8-20", async () => {
    const response = await request(app)
      .get("/admin/best-profession?start=2020-08-05&end=2020-08-14")
      .set({ is_admin: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.bestProfession).toBe("Musician");
    expect(response.body.data.maxEarning).toBe(21);
  });

  it("Case: Date Range: 5-8-20 to 25-8-20", async () => {
    const response = await request(app)
      .get("/admin/best-profession?start=2020-08-05&end=2020-08-25")
      .set({ is_admin: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.bestProfession).toBe("Programmer");
    expect(response.body.data.maxEarning).toBe(2683);
  });

  it("Case: No Data Found", async () => {
    const response = await request(app)
      .get("/admin/best-profession?start=2020-08-05&end=2020-08-07")
      .set({ is_admin: 1 });

    expect(response.statusCode).toBe(204);
  });
});

describe("Endpoint: /admin/best-clients?start=<date>&end=<date>&limit=<integer>", () => {
  it("Case: Date Range: 5-8-20 to 15-8-20", async () => {
    const response = await request(app)
      .get("/admin/best-clients?start=2020-08-05&end=2020-08-15")
      .set({ is_admin: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.result.length).toBe(2);
    expect(response.body.data.result[0].paid).toBe(121);
  });

  it("Case: Date Range: 5-8-20 to 25-8-20", async () => {
    const response = await request(app)
      .get("/admin/best-clients?start=2020-08-05&end=2020-08-20")
      .set({ is_admin: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.result.length).toBe(2);
    expect(response.body.data.result[0].paid).toBe(2020);
    expect(response.body.data.result[0].fullName).toBe("Ash Kethcum");
  });

  it("Case: No Data Found", async () => {
    const response = await request(app)
      .get("/admin/best-clients?start=2020-08-05&end=2020-08-07")
      .set({ is_admin: 1 });

    expect(response.statusCode).toBe(204);
  });
});