const request = require("supertest");
const app = require("../app");

describe("Endpoint: /jobs/unpaid", () => {
  it("Case: Unpaid Job for user: 7", async () => {
    const response = await request(app)
      .get("/jobs/unpaid")
      .set({ profile_id: 7 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].id).toBe(4);
    expect(response.body.data[1].id).toBe(5);
  });

  it("Case: Unpaid Job for user: 1", async () => {
    const response = await request(app)
      .get("/jobs/unpaid")
      .set({ profile_id: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(2);
  });

  it("Case: User not found", async () => {
    const response = await request(app)
      .get("/jobs/unpaid")
      .set({ profile_id: 129 });

    expect(response.statusCode).toBe(401);
  });

  it("Case: Unpaid jobs for user: 3", async () => {
    const response = await request(app)
      .get("/jobs/unpaid")
      .set({ profile_id: 3 });

    expect(response.statusCode).toBe(204);
  });
});

describe("Endpoint: /jobs/:job_id/pay", () => {
  it("Case: Invalid Job Id", async () => {
    const response = await request(app)
      .post("/jobs/101/pay");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('INVALID_DATA');
  });

  it("Case: Already paid job", async () => {
    const response = await request(app)
      .post("/jobs/7/pay");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('ALREADY_PAID');
  });

  it("Case: Successfull payment", async () => {
    const response = await request(app)
      .post("/jobs/1/pay");

    expect(response.statusCode).toBe(200);
    expect(response.body.data.paid).toBe(true);
  });
});

describe("Endpoint: /balances/deposit/:userId", () => {
  it("Case: Deposit Limit Exceeded ", async () => {
    const response = await request(app)
      .post("/balances/deposit/1")
      .send({
        depositAmount: 1000
      })

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('DEPOSIT_LIMIT_EXCEEDED');
  });

  it("Case: Invalid User Type ", async () => {
    const response = await request(app)
      .post("/balances/deposit/7")
      .send({
        depositAmount: 50
      })

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('INVALID_PROFILE_TYPE');
  });

  it("Case: Successfull Deposit ", async () => {
    const response = await request(app)
      .post("/balances/deposit/4")
      .send({
        depositAmount: 50
      })

    expect(response.statusCode).toBe(200);
    expect(response.body.data.profile.balance).toBe(51.3);
  });

  it("Case: Failed Transaction ", async () => {
    const response = await request(app)
      .post("/balances/deposit/4")
      .send({
        depositAmount: null
      })

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('\"depositAmount\" must be a number');
  });
});
