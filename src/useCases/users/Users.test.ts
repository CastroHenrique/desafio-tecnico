import request from "supertest";
import { app } from "../../app";
import { AccessLevel } from "../../entities/UserEntity";
import knex from "../../knex";

describe("User create", () => {
  it("Should be able to create user", async () => {
    const newUser = {
      name: "Teste 1",
      username: "teste1",
      email: "teste1@site.com",
      password: "password",
      confirmPassword: "password",
      document: "12345678901",
      accessLevel: AccessLevel.SU,
      status: true,
    };

    await request(app)
      .post(`/users`)
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("name", newUser.name);
        expect(response.body.data).toHaveProperty("email", newUser.email);
        expect(response.body.data).toHaveProperty("username", newUser.username);
        expect(response.body.data).toHaveProperty("status", newUser.status ? 1 : 0);
        expect(response.body.data).toHaveProperty("document", newUser.document);
        expect(response.body.data).toHaveProperty(
          "accessLevel",
          newUser.accessLevel,
        );
        expect(response.body.data).not.toHaveProperty("password");
      });

    const user: any = await knex("users").where("email", newUser.email).first();

    expect(user).not.toBeUndefined();
    expect(user).toHaveProperty("name", newUser.name);
    expect(user).toHaveProperty("email", newUser.email);
    expect(user).toHaveProperty("status");
    expect(user.status).toBe(1);
    expect(user).toHaveProperty("document", newUser.document);
    expect(user).toHaveProperty("accessLevel", newUser.accessLevel);
    expect(user).toHaveProperty("username", newUser.username);

  });

  it("Shouldn't be able to create user if don't pass required data", async () => {
    await request(app)
      .post(`/users`)
      .send({
        email: "teste2@site.com",
        password: "password",
        username: "teste2",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post(`/users`)
      .send({
        name: "Teste 2",
        password: "password",
        username: "teste2",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post(`/users`)
      .send({
        name: "Teste 2",
        email: "teste2@site.com",
        username: "teste2",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post(`/users`)
      .send({
        name: "Teste 2",
        email: "teste2@site.com",
        password: "password",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    const user: any = await knex("users")
      .where("email", "teste2@site.com")
      .first();

    expect(user).toBeUndefined();
  });

  it("Shouldn't be able to create user if email or username already exists", async () => {
    const newUser = {
      name: "Teste 1",
      email: "teste1@site.com",
      username: "uniqueusername",
      password: "password",
      confirmPassword: "password",
      document: "12345678901",
      accessLevel: AccessLevel.N,
      status: false,
    };

    await request(app)
      .post(`/users`)
      .send(newUser)
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .post(`/users`)
      .send({
        ...newUser,
        username: "teste1",
        email: "uniqueemail@site.com",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    const uniqueUsernameRow: any = await knex("users")
      .where("username", "uniqueusername")
      .first();

    expect(uniqueUsernameRow).toBeUndefined();

    const uniqueEmailRow: any = await knex("users")
      .where("email", "uniqueemail@site.com")
      .first();

    expect(uniqueEmailRow).toBeUndefined();
  });
});

describe("Users list", () => {
  it("Should be able to list users", async () => {
    await request(app)
      .get(`/users`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0]).toHaveProperty("name");
        expect(response.body.data[0]).toHaveProperty("email");
        expect(response.body.data[0]).toHaveProperty("username");
        expect(response.body.data[0]).toHaveProperty("status");
        expect([true, false, 0, 1]).toContain(response.body.data[0].status);
        expect(response.body.data[0]).toHaveProperty("document");
        expect(response.body.data[0]).not.toHaveProperty("password");
      });
    });
});

describe("User update", () => {
  it("Should be able to update user", async () => {
    const newUser = {
      id: "f745c951-7471-4bb9-b279-89d9cc3211ad",
      name: "Updated 1",
      username: "updated1",
      email: "updated1@site.com",
      password: "password",
      confirmPassword: "password",
      document: "12345678901",
      accessLevel: AccessLevel.N,
      status: false,
    };

    await request(app)
      .put(`/users`)
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("name", newUser.name);
        expect(response.body.data).toHaveProperty("email", newUser.email);
        expect(response.body.data).toHaveProperty("username", newUser.username);
        expect(response.body.data).toHaveProperty("status");
        expect(response.body.data.status).toBe(newUser.status ? 1 : 0);
        expect(response.body.data).toHaveProperty("document", newUser.document);
        expect(response.body.data).toHaveProperty("accessLevel", newUser.accessLevel);
        expect(response.body.data).not.toHaveProperty("password");
      });

    const user: any = await knex("users")
      .where("id", "f745c951-7471-4bb9-b279-89d9cc3211ad")
      .first();

    expect(user).not.toBeUndefined();
    expect(user).toHaveProperty("name", newUser.name);
    expect(user).toHaveProperty("email", newUser.email);
    expect(user).toHaveProperty("status");
    expect(user.status).toBe(newUser.status ? 1 : 0);
    expect(user).toHaveProperty("document", newUser.document);
    expect(user).toHaveProperty("accessLevel", newUser.accessLevel);
    expect(user).toHaveProperty("username", newUser.username);
  });

  it("Shouldn't be able to update user if don't pass required data", async () => {
  
    await request(app)
      .put("/users")
      .send({
        email: "updated2@site.com",
        password: "password",
        username: "updated2",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .put("/users")
      .send({
        id: "e09c30fa-8ab2-42e2-9f7d-aa21a7491f0b",
        password: "password",
        username: "updated2",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    const user: any = await knex("users")
      .where("email", "updated2@site.com")
      .first();

    expect(user).toBeUndefined();
  });

  it("Shouldn't be able to update user if email or username already exists in another user", async () => {
    const userIdToUpdate = "2ed6a353-df65-424e-a126-b7884d78b07f";
    const payloadConflictEmail = {
      id: userIdToUpdate,
      name: "Updated 3",
      email: "dev@site.com",
      username: "toupdate1",
      password: "password",
      document: "12345678901",
    };

    await request(app)
      .put("/users")
      .send(payloadConflictEmail)
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    await request(app)
      .put("/users")
      .send({
        ...payloadConflictEmail,
        username: "dev",
        email: "dev@site.com",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", false);
      });

    const uniqueUsernameRow: any = await knex("users")
      .where("username", "uniqueusername")
      .first();

    expect(uniqueUsernameRow).toBeUndefined();

    const uniqueEmailRow: any = await knex("users")
      .where("email", "uniqueemail@site.com")
      .first();

    expect(uniqueEmailRow).toBeUndefined();
  });

});

describe("User delete", () => {
  it("Should be able to delete user", async () => {
 
    const requestingUserId = "a4d437ed-b2ef-4c5a-abc9-2ab5c95b294c";
    const userIdToDelete = "20c84cb5-9d28-4b12-9ea7-7b160ff6722d";

    await request(app)
      .delete(`/users/${requestingUserId}/${userIdToDelete}`)
      .auth(process.env.TOKEN_TEST || "", { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).not.toHaveProperty("message");
        expect(response.body).toHaveProperty("status", true);
      });

    const savedUser: any = await knex("users")
      .where("id", userIdToDelete)
      .first();

    expect(savedUser).not.toBeUndefined();
    expect(savedUser.deletedAt).not.toBeUndefined();
    expect(savedUser.deletedAt).not.toBeNull();
  });
});


