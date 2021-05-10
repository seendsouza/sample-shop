import request from "supertest";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Product, {
  ProductDocument,
} from "../../products/models/product.model.js";
import Cart, { CartDocument } from "../models/cart.model.js";
import User from "../../users/models/user.model.js";
import express from "../../core/express.js";
import type { Express } from "express";

describe("Cart CRUD tests:", () => {
  let product1: any,
    cart1: any,
    agent: request.SuperAgentTest,
    authenticatedAgent: request.SuperAgentTest,
    app: Express,
    product: ProductDocument,
    cart: CartDocument;

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
      email: "cart@test.com",
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
      cart = new Cart();
      cart.save((err) => {
        expect(err).toBeNull();

        done();
      });
    });
  });
  afterEach(async () => {
    await Cart.deleteMany({}).exec();
    await Product.deleteOne({ _id: product._id }).exec();
  });

  afterAll(async () => {
    await User.deleteOne({ email: "cart@test.com" }).exec();
    await mongoose.connection.close();
  });

  describe("Get carts", () => {
    it("should list all carts", (done) => {
      authenticatedAgent
        .get("/api/carts")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.length).toEqual(1);
          return done();
        });
    });
    it("should return a 403 without authentication", (done) => {
      agent
        .get("/api/carts")
        .expect(403)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).toEqual("User is not authorized");
          return done();
        });
    });
  });
  describe("Get cart by ID", () => {
    it("should get a cart by ID", (done) => {
      agent
        .get(`/api/carts/${cart._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual(JSON.parse(JSON.stringify(cart)));
          return done();
        });
    });
  });

  describe("Check cart by ID", () => {
    it("should get a cart by ID", (done) => {
      agent
        .get(`/api/carts/check/${cart._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual(JSON.parse(JSON.stringify(cart)));
          return done();
        });
    });
    it("should return a 400 for a cart with an invalid ID", (done) => {
      agent
        .get(`/api/carts/check/invalid_id`)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).toEqual("Cart is invalid");
          return done();
        });
    });
    it("should return a 404 for a cart with a non-existent valid ID", (done) => {
      agent
        .get(`/api/carts/check/608208c6a28e4800424adf69`)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).toEqual(
            "No cart with that identifier has been found"
          );
          return done();
        });
    });
  });

  describe("Create cart", () => {
    it("should create a cart", (done) => {
      agent
        .post(`/api/carts`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).toEqual("active");
          return done();
        });
    });
  });
});
