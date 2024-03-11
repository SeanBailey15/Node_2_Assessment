// Set ENV VAR to test before we load anything, so our app's config will use
// testing settings

process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");

// tokens for our sample users
const tokens = {};

/** before each test, insert u1, u2, and u3  [u3 is admin] */

beforeEach(async function () {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1);
  }

  let sampleUsers = [
    ["u1", "fn1", "ln1", "email1", "phone1", await _pwd("pwd1"), false],
    ["u2", "fn2", "ln2", "email2", "phone2", await _pwd("pwd2"), false],
    ["u3", "fn3", "ln3", "email3", "phone3", await _pwd("pwd3"), true],
  ];

  for (let user of sampleUsers) {
    await db.query(
      `INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      user
    );
    tokens[user[0]] = createToken(user[0], user[6]);
  }
});

describe("POST /auth/register", function () {
  test("should allow a user to register in", async function () {
    const response = await request(app).post("/auth/register").send({
      username: "new_user",
      password: "new_password",
      first_name: "new_first",
      last_name: "new_last",
      email: "new@newuser.com",
      phone: "1233211221",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("new_user");
    expect(admin).toBe(false);
  });

  test("should not allow a user to register with an existing username", async function () {
    const response = await request(app).post("/auth/register").send({
      username: "u1",
      password: "pwd1",
      first_name: "new_first",
      last_name: "new_last",
      email: "new@newuser.com",
      phone: "1233211221",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: `There already exists a user with username 'u1'`,
    });
  });
});

describe("POST /auth/login", function () {
  test("should allow a correct username/password to log in", async function () {
    const response = await request(app).post("/auth/login").send({
      username: "u1",
      password: "pwd1",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("u1");
    expect(admin).toBe(false);
  });

  //**************************************************************************
  // TESTS BUG #2
  test("BUG 2 - WILL FAIL IF FIXED: should allow unregistered users to login with any password", async function () {
    const response = await request(app).post("/auth/login").send({
      username: "unregistered",
      password: "password",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("unregistered");
    expect(admin).toBe(false);
  });
  //**************************************************************************

  //**************************************************************************
  // TESTS BUG #2 FIX
  test("BUG 2 - WILL PASS IF FIXED: only registered users allowed", async function () {
    try {
      const response = await request(app).post("/auth/login").send({
        username: "unregistered",
        password: "password",
      });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("BUG 2 - WILL PASS IF FIXED: only valid passwords allowed", async function () {
    try {
      const response = await request(app).post("/auth/login").send({
        username: "u1",
        password: "notcorrect",
      });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
  //**************************************************************************
});

describe("GET /users", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(401);
  });

  test("should list all users", async function () {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
  });

  //**************************************************************************
  // TESTS BUG #1
  test("BUG 1 - WILL FAIL IF FIXED: should allow unverified tokens", async function () {
    const badToken = jwt.sign(
      {
        username: "hacker",
        admin: true,
      },
      "I AM A BAD GUY"
    );
    console.log(jwt.decode(badToken));
    const response = await request(app)
      .get("/users")
      .send({ _token: badToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
  });
  //**************************************************************************

  //**************************************************************************
  // TESTS BUG #1 FIX
  test("BUG 1 - WILL PASS IF FIXED: only verified tokens allowed", async function () {
    try {
      const badToken = jwt.sign(
        {
          username: "hacker",
          admin: true,
        },
        "I AM A BAD GUY"
      );
      const response = await request(app)
        .get("/users")
        .send({ _token: badToken });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
  //**************************************************************************

  //**************************************************************************
  // TESTS BUG #3
  test("BUG 3 - WILL FAIL IF FIXED: returns more user information than required", async function () {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      users: [
        {
          username: "u1",
          first_name: "fn1",
          last_name: "ln1",
          email: "email1",
          phone: "phone1",
        },
        {
          username: "u2",
          first_name: "fn2",
          last_name: "ln2",
          email: "email2",
          phone: "phone2",
        },
        {
          username: "u3",
          first_name: "fn3",
          last_name: "ln3",
          email: "email3",
          phone: "phone3",
        },
      ],
    });
  });
  //**************************************************************************

  //**************************************************************************
  // TESTS BUG #3 FIX
  test("BUG 3 - WILL PASS IF FIXED: returns only 'basic' info as described in route docstring", async function () {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      users: [
        {
          username: "u1",
          first_name: "fn1",
          last_name: "ln1",
        },
        {
          username: "u2",
          first_name: "fn2",
          last_name: "ln2",
        },
        {
          username: "u3",
          first_name: "fn3",
          last_name: "ln3",
        },
      ],
    });
  });
});

describe("GET /users/[username]", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).get("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should return data on u1", async function () {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
    });
  });

  //**************************************************************************
  // TEST BUG #4
  test("BUG 4 - WILL FAIL IF FIXED: does not throw error properly", async function () {
    const response = await request(app)
      .get("/users/nothere")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });
  //**************************************************************************

  //**************************************************************************
  // TEST BUG #4 FIX
  test("BUG 4 - WILL PASS IF FIXED: throws error properly", async function () {
    const response = await request(app)
      .get("/users/nothere")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      message: "No such user",
    });
  });
  //**************************************************************************
});

describe("PATCH /users/[username]", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).patch("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should deny access if not admin/right user", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u2 }); // wrong user!
    expect(response.statusCode).toBe(401);
  });

  test("should patch data if admin", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u3, first_name: "new-fn1" }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String),
    });
  });

  test("should return 404 if cannot find", async function () {
    const response = await request(app)
      .patch("/users/not-a-user")
      .send({ _token: tokens.u3, first_name: "new-fn" }); // u3 is admin
    expect(response.statusCode).toBe(404);
  });

  //**************************************************************************
  // RELATED TO BUG #5, BUT TEST UNALTERED. NEW LOGIC IMPLEMENTS THIS FUNCTIONALITY
  // WHILE BUGGED LOGIC PASSED THIS TEST BY COINCIDENCE
  test("should disallowing patching not-allowed-fields", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, admin: true });
    expect(response.statusCode).toBe(401);
  });
  //**************************************************************************

  //**************************************************************************
  // TEST BUG #5
  test("BUG 5 - WILL FAIL IF FIXED: will throw error when logged in user accesses route", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, first_name: "you1" });
    expect(response.statusCode).toBe(401);
  });
  //**************************************************************************

  //**************************************************************************
  // TEST BUG #5 FIX
  test("BUG 5 - WILL PASS IF FIXED: will allow standard user to access route", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, first_name: "You1" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      user: {
        username: "u1",
        first_name: "You1",
        last_name: "ln1",
        email: "email1",
        phone: "phone1",
        admin: false,
        password: expect.any(String),
      },
    });
  });
  //**************************************************************************

  //**************************************************************************
  // BUG #5 TESTS RELATING TO NEW LOGIC:
  test("throws error for standard user attempts to update admin privilege", async function () {
    try {
      const response = await request(app)
        .patch("/users/u1")
        .send({ _token: tokens.u1, admin: true });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("admin allowed to update admin privilege", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u3, admin: true });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      user: {
        username: "u1",
        first_name: "fn1",
        last_name: "ln1",
        email: "email1",
        phone: "phone1",
        admin: true,
        password: expect.any(String),
      },
    });
  });

  test("throws error if user attempts to update password", async function () {
    try {
      const response = await request(app)
        .patch("/users/u1")
        .send({ _token: tokens.u1, password: "new" });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("throws error if user attempts to update username", async function () {
    try {
      const response = await request(app)
        .patch("/users/u1")
        .send({ _token: tokens.u1, username: "new" });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("throws error if admin attempts to update password", async function () {
    try {
      const response = await request(app)
        .patch("/users/u1")
        .send({ _token: tokens.u3, password: "new" });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("throws error if admin attempts to update username", async function () {
    try {
      const response = await request(app)
        .patch("/users/u1")
        .send({ _token: tokens.u3, username: "new" });
      expect(response.statusCode).toBe(401);
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
  //**************************************************************************
});

describe("DELETE /users/[username]", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).delete("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should deny access if not admin", async function () {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(401);
  });

  test("should allow if admin", async function () {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u3 }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "deleted" });
  });
});

afterEach(async function () {
  await db.query("DELETE FROM users");
});

afterAll(function () {
  db.end();
});
