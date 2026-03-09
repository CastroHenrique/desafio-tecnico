import request from "supertest";
import { app } from "../../app";
import { RentalProposalsStatus } from "../../entities/RentalProposals";
import knex from "../../knex";

const SEED_PROPERTY_ID = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";
const SEED_PROPERTY_ID_2 = "b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e";
const SEED_PROPERTY_ID_3 = "c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f";
const SEED_USER_ID = "f745c951-7471-4bb9-b279-89d9cc3211ad";

describe("RentalProposal create", () => {
  it("Should be able to create rental proposal", async () => {
    const newProposal = {
      propertyId: SEED_PROPERTY_ID,
      userId: SEED_USER_ID,
    };

    await request(app)
      .post("/rentalProposals")
      .send(newProposal)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data).toHaveProperty("propertyId", newProposal.propertyId);
        expect(response.body.data).toHaveProperty("userId", newProposal.userId);
        expect(response.body.data).toHaveProperty("status", RentalProposalsStatus.NOVA);
        expect(response.body.data).not.toHaveProperty("createdAt");
        expect(response.body.data).not.toHaveProperty("updatedAt");
        expect(response.body.data).not.toHaveProperty("deletedAt");
      });

    const proposal: any = await knex("rental_proposals")
      .where("propertyId", newProposal.propertyId)
      .where("userId", newProposal.userId)
      .whereNull("deletedAt")
      .first();

    expect(proposal).not.toBeUndefined();
    expect(proposal).toHaveProperty("propertyId", newProposal.propertyId);
    expect(proposal).toHaveProperty("userId", newProposal.userId);
    expect(proposal).toHaveProperty("status", RentalProposalsStatus.NOVA);
  });

  it("Shouldn't be able to create rental proposal if don't pass required data", async () => {
    await request(app)
      .post("/rentalProposals")
      .send({ userId: SEED_USER_ID })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post("/rentalProposals")
      .send({ propertyId: SEED_PROPERTY_ID })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post("/rentalProposals")
      .send({})
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });
  });

  it("Shouldn't be able to create rental proposal if property does not exist", async () => {
    await request(app)
      .post("/rentalProposals")
      .send({
        propertyId: "00000000-0000-0000-0000-000000000000",
        userId: SEED_USER_ID,
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });
  });
});

describe("RentalProposals list", () => {
  it("Should be able to list rental proposals", async () => {
    await request(app)
      .get("/rentalProposals")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data.length > 0) {
          expect(response.body.data[0]).toHaveProperty("id");
          expect(response.body.data[0]).toHaveProperty("propertyId");
          expect(response.body.data[0]).toHaveProperty("userId");
          expect(response.body.data[0]).toHaveProperty("status");
        }
      });
  });
});

describe("RentalProposal update", () => {
  it("Should be able to update rental proposal status", async () => {
    const createRes = await request(app)
      .post("/rentalProposals")
      .send({
        propertyId: SEED_PROPERTY_ID_2,
        userId: "e09c30fa-8ab2-42e2-9f7d-aa21a7491f0b",
      });

    if (createRes.status !== 201) {
      throw new Error(
        "Precondition: create proposal failed - " +
          JSON.stringify(createRes.body),
      );
    }

    const proposalId = createRes.body.data.id;

    await request(app)
      .put("/rentalProposals")
      .send({
        id: proposalId,
        status: RentalProposalsStatus.ANALISE_CREDITO,
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id", proposalId);
        expect(response.body.data).toHaveProperty(
          "status",
          RentalProposalsStatus.ANALISE_CREDITO,
        );
      });

    const proposal: any = await knex("rental_proposals")
      .where("id", proposalId)
      .whereNull("deletedAt")
      .first();

    expect(proposal).not.toBeUndefined();
    expect(proposal.status).toBe(RentalProposalsStatus.ANALISE_CREDITO);
  });

  it("Shouldn't be able to update rental proposal if don't pass required data", async () => {
    await request(app)
      .put("/rentalProposals")
      .send({ status: RentalProposalsStatus.ANALISE_CREDITO })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .put("/rentalProposals")
      .send({ id: "00000000-0000-0000-0000-000000000000" })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });
  });

  it("Shouldn't be able to update rental proposal with invalid status transition", async () => {
    const createRes = await request(app)
      .post("/rentalProposals")
      .send({
        propertyId: SEED_PROPERTY_ID_3,
        userId: "2ed6a353-df65-424e-a126-b7884d78b07f",
      });

    if (createRes.status !== 201) {
      throw new Error(
        "Precondition: create proposal failed - " +
          JSON.stringify(createRes.body),
      );
    }

    const proposalId = createRes.body.data.id;

    await request(app)
      .put("/rentalProposals")
      .send({
        id: proposalId,
        status: RentalProposalsStatus.ASSINADO,
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    const proposal: any = await knex("rental_proposals")
      .where("id", proposalId)
      .whereNull("deletedAt")
      .first();

    expect(proposal).not.toBeUndefined();
    expect(proposal.status).toBe(RentalProposalsStatus.NOVA);
  });
});
