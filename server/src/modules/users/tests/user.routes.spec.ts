import request from "supertest";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User, { IUser, UserDocument } from "../models/user.model.js";
import express from "../../core/express.js";
import type { Express } from "express";

describe("User CRUD tests:", () => {
  let user1: IUser,
    user2: IUser,
    agent: request.SuperAgentTest,
    app: Express,
    user: UserDocument,
    unhashedPassword: string;

  beforeAll(async () => {
    const url = process.env.MONGO_URL;
    if (!url) process.exit(1);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app = express.init();
    agent = request.agent(app);
    unhashedPassword = "M3@n.jsI$Aw3$0m3";
    const password = bcrypt.hashSync(unhashedPassword, 10);
    user1 = {
      email: "user@test.com",
      password: password,
    };

    user2 = {
      email: "user2@test.com",
      password: password,
    };
  });

  beforeEach((done) => {
    user = new User(user1);
    user.save((err) => {
      expect(err).toBeNull();
      done();
    });
  });
  afterEach(async () => {
    await User.deleteOne({ email: user1.email }).exec();
    await User.deleteOne({ email: user2.email }).exec();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should be able to register a new user", (done) => {
    agent
      .post("/api/users")
      .send(user2)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toEqual("Signed up!");
        return done();
      });
  });

  it("should be able to login with email successfully", (done) => {
    agent
      .put("/api/users")
      .send({ email: user1.email, password: unhashedPassword })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it("should return a 401 if with wrong email", (done) => {
    agent
      .put("/api/users")
      .send({ email: user2.email, password: unhashedPassword })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it("should return a 401 if with wrong password", (done) => {
    agent
      .put("/api/users")
      .send({ email: user1.email, password: "password" })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it("should be able to check token after login", (done) => {
    agent
      .put("/api/users")
      .send({ email: user1.email, password: unhashedPassword })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      });
    agent
      .get("/api/users/token")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
