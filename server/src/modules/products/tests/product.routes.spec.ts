import request from "supertest";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Product, { ProductDocument } from "../models/product.model.js";
import User from "../../users/models/user.model.js";
import express from "../../core/express.js";
import type { Express } from "express";

describe("Product CRUD tests:", () => {
  let product1: any,
    agent: request.SuperAgentTest,
    authenticatedAgent: request.SuperAgentTest,
    app: Express,
    product: ProductDocument;

  beforeAll(async (done) => {
    const url = process.env.MONGO_URL;
    if (!url) process.exit(1);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app = express.init();
    agent = request.agent(app);
    authenticatedAgent = request.agent(app);

    product1 = {
      name: "Sample Sweater",
      qty: 5,
      item_details: new Map(
        Object.entries({
          price: 52.33,
          image:
            "https://react.semantic-ui.com/images/avatar/large/matthew.png",
          description: "description",
        })
      ),
    };

    const unhashedPassword = "M3@n.jsI$Aw3$0m3";
    const password = bcrypt.hashSync(unhashedPassword, 10);
    const user1 = {
      email: "product@test.com",
      password: password,
    };

    const user = new User(user1);
    user.save((err) => {
      expect(err).toBeNull();
      authenticatedAgent
        .put("/api/users")
        .send({ email: user1.email, password: unhashedPassword })
        .expect(200)
        .end((err, _) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });

  beforeEach((done) => {
    product = new Product(product1);
    product.save((err) => {
      expect(err).toBeNull();
      done();
    });
  });
  afterEach(async () => {
    await Product.deleteMany({}).exec();
  });

  afterAll(async () => {
    await User.deleteOne({ email: "product@test.com" }).exec();
    await mongoose.connection.close();
  });

  it("should list all products", (done) => {
    agent
      .get("/api/products")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).toEqual(1);
        return done();
      });
  });
  describe("Get product by ID", () => {
    it("should get a product by ID", (done) => {
      agent
        .get(`/api/products/${product._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual(JSON.parse(JSON.stringify(product)));
          return done();
        });
    });
    it("should return a 400 for a product with an invalid ID", (done) => {
      agent
        .get(`/api/products/invalid_id`)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).toEqual("Product is invalid");
          return done();
        });
    });
    it("should return a 404 for a product with a non-existent valid ID", (done) => {
      agent
        .get(`/api/products/608208c6a28e4800424adf69`)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).toEqual(
            "No product with that identifier has been found"
          );
          return done();
        });
    });
  });

  describe("Create product", () => {
    it("should create a product", (done) => {
      authenticatedAgent
        .post(`/api/products`)
        .send({
          qty: 178,

          price: 52.33,
          image:
            "https://react.semantic-ui.com/images/avatar/large/matthew.png",
          description: "description",
          name: "new",
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.qty).toEqual(178);
          return done();
        });
    });
    it("should return a 400 with invalid product", (done) => {
      authenticatedAgent
        .post(`/api/products`)
        .send({
          invalid: "product",
        })
        .expect(400)
        .end((err, _) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });

    it("should return a 403 without authentication", (done) => {
      agent
        .post(`/api/products`)
        .send({
          qty: 178,
          description: "description",
          price: 52.33,
          image:
            "https://react.semantic-ui.com/images/avatar/large/matthew.png",
          _id: "608208c6a28e4800424adf69",
          name: "new",
        })
        .expect(403)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual({ message: "User is not authorized" });
          return done();
        });
    });
  });
  describe("Update product by ID", () => {
    it("should update a product by ID", (done) => {
      authenticatedAgent
        .put(`/api/products/${product._id}`)
        .send({
          qty: 178,

          price: 52.33,
          image:
            "https://react.semantic-ui.com/images/avatar/large/matthew.png",
          description: "description",
          _id: "608208c6a28e4800424adf69",
          name: "new",
        })
        .expect(200)
        .end((err, _) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
    it("should return a 400 with invalid product", (done) => {
      authenticatedAgent
        .put(`/api/products/${product._id}`)
        .send({
          invalid: "product",
        })
        .expect(400)
        .end((err, _) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
    it("should return a 404 for a product with a non-existent valid ID", (done) => {
      authenticatedAgent
        .put(`/api/products/608208c6a28e4800424adf69`)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual({
            message: "No product with that identifier has been found",
          });
          return done();
        });
    });
    it("should return a 403 without authentication", (done) => {
      agent
        .put(`/api/products/${product._id}`)
        .send({
          qty: 178,

          price: 52.33,
          image:
            "https://react.semantic-ui.com/images/avatar/large/matthew.png",
          description: "description",
          _id: "608208c6a28e4800424adf69",
          name: "new",
        })
        .expect(403)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual({ message: "User is not authorized" });
          return done();
        });
    });
  });

  describe("Delete product by ID", () => {
    it("should delete a product by ID", (done) => {
      authenticatedAgent
        .delete(`/api/products/${product._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual({ success: true });
          return done();
        });
    });
    it("should return a 404 for a product with a non-existent valid ID", (done) => {
      authenticatedAgent
        .delete(`/api/products/608208c6a28e4800424adf69`)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual({
            message: "No product with that identifier has been found",
          });
          return done();
        });
    });
    it("should return a 403 without authentication", (done) => {
      agent
        .delete(`/api/products/${product._id}`)
        .expect(403)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual({ message: "User is not authorized" });
          return done();
        });
    });
  });
});
