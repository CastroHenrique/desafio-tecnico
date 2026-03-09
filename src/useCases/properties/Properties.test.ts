import request from "supertest";
import { app } from "../../app";
import { PropertiesStatus } from "../../entities/PropertiesEntity";
import knex from "../../knex";

const SEED_PROPERTY_ID = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";
const SEED_USER_ID = "a4d437ed-b2ef-4c5a-abc9-2ab5c95b294c";

const newPropertyPayload = {
  price: 1800,
  addressZipCode: "22041080",
  addressStreet: "Rua Nascimento Silva",
  addressNumber: "100",
  addressComplement: "Apto 101",
  addressNeighborhood: "Ipanema",
  addressCity: "Rio de Janeiro",
  addressState: "RJ",
};

describe("Property create", () => {
  it("Should be able to create property", async () => {
    const response = await request(app)
      .post("/properties")
      .send(newPropertyPayload)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).not.toHaveProperty("message");
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("price", newPropertyPayload.price);
    expect(response.body.data).toHaveProperty("addressZipCode", newPropertyPayload.addressZipCode);
    expect(response.body.data).toHaveProperty("addressStreet", newPropertyPayload.addressStreet);
    expect(response.body.data).toHaveProperty("addressNumber", newPropertyPayload.addressNumber);
    expect(response.body.data).toHaveProperty("addressNeighborhood", newPropertyPayload.addressNeighborhood);
    expect(response.body.data).toHaveProperty("addressCity", newPropertyPayload.addressCity);
    expect(response.body.data).toHaveProperty("addressState", newPropertyPayload.addressState);
    expect(response.body.data).toHaveProperty("status", PropertiesStatus.DISPONIVEL);
    expect(response.body.data).toHaveProperty("fullAddress");
    expect(response.body.data).not.toHaveProperty("createdAt");
    expect(response.body.data).not.toHaveProperty("updatedAt");
    expect(response.body.data).not.toHaveProperty("deletedAt");

    const property: any = await knex("properties")
      .where("id", response.body.data.id)
      .whereNull("deletedAt")
      .first();

    expect(property).not.toBeUndefined();
    expect(property).toHaveProperty("price", newPropertyPayload.price);
    expect(property).toHaveProperty("addressZipCode", newPropertyPayload.addressZipCode);
    expect(property).toHaveProperty("status", PropertiesStatus.DISPONIVEL);
  });

  it("Shouldn't be able to create property if don't pass required data", async () => {
    await request(app)
      .post("/properties")
      .send({
        addressZipCode: "22041080",
        addressStreet: "Rua Nascimento Silva",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post("/properties")
      .send({
        ...newPropertyPayload,
        reference: 9002,
        price: undefined,
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post("/properties")
      .send({})
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });
  });
});

describe("Properties list", () => {
  it("Should be able to list properties", async () => {
    await request(app)
      .get("/properties")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data.length > 0) {
          expect(response.body.data[0]).toHaveProperty("id");
          expect(response.body.data[0]).toHaveProperty("price");
          expect(response.body.data[0]).toHaveProperty("addressZipCode");
          expect(response.body.data[0]).toHaveProperty("addressStreet");
          expect(response.body.data[0]).toHaveProperty("status");
        }
      });
  });
});

describe("Property update", () => {
  it("Should be able to update property", async () => {
    const updatePayload = {
      id: SEED_PROPERTY_ID,
      reference: 1001,
      price: 1600,
      addressZipCode: "01310100",
      addressStreet: "Avenida Paulista",
      addressNumber: "1000",
      addressComplement: "Sala 1",
      addressNeighborhood: "Bela Vista",
      addressCity: "São Paulo",
      addressState: "SP",
    };

    await request(app)
      .put(`/properties/${SEED_PROPERTY_ID}`)
      .send(updatePayload)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id", SEED_PROPERTY_ID);
        expect(response.body.data).toHaveProperty("price", updatePayload.price);
        expect(response.body.data).toHaveProperty("addressComplement", updatePayload.addressComplement);
      });

    const property: any = await knex("properties")
      .where("id", SEED_PROPERTY_ID)
      .whereNull("deletedAt")
      .first();

    expect(property).not.toBeUndefined();
    expect(property.price).toBe(updatePayload.price);
    expect(property.addressComplement).toBe(updatePayload.addressComplement);
  });

  it("Shouldn't be able to update property if don't pass required data", async () => {
    await request(app)
      .put(`/properties/${SEED_PROPERTY_ID}`)
      .send({
        id: SEED_PROPERTY_ID,
        price: 1600,
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });
  });

  it("Shouldn't be able to update property if property does not exist", async () => {
    await request(app)
      .put("/properties/00000000-0000-0000-0000-000000000000")
      .send({
        id: "00000000-0000-0000-0000-000000000000",
        reference: 9999,
        price: 1000,
        addressZipCode: "01310100",
        addressStreet: "Rua X",
        addressNumber: "1",
        addressComplement: "",
        addressNeighborhood: "Bela Vista",
        addressCity: "São Paulo",
        addressState: "SP",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });
  });
});

describe("Property delete", () => {
  it("Should be able to delete property (soft delete)", async () => {
    const createRes = await request(app)
      .post("/properties")
      .send({
        ...newPropertyPayload,
        addressNumber: "300",
      });

    if (createRes.status !== 200) {
      throw new Error(
        "Precondition: create property failed - " + JSON.stringify(createRes.body),
      );
    }

    const propertyId = createRes.body.data.id;

    await request(app)
      .delete(`/properties/${propertyId}/${SEED_USER_ID}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
      });

    const property: any = await knex("properties").where("id", propertyId).first();

    expect(property).not.toBeUndefined();
    expect(property.deletedAt).not.toBeUndefined();
    expect(property.deletedAt).not.toBeNull();
    expect(property.deletedBy).toBe(SEED_USER_ID);
  });

  it("Shouldn't be able to delete property if property does not exist", async () => {
    await request(app)
      .delete(`/properties/00000000-0000-0000-0000-000000000000/${SEED_USER_ID}`)
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });
  });
});
