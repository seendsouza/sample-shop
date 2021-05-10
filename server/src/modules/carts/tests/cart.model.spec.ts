import type { CallbackError } from "mongoose";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

describe("Cart Model Unit Tests:", () => {
  let cart1: Object;
  beforeAll(async () => {
    const url = process.env.MONGO_URL;
    if (!url) process.exit(1);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cart1 = {
      status: "active",
      last_modified: "2021-04-22T23:41:26.232Z",
      items: [],
    };
  });

  afterAll(async () => {
    await Cart.deleteMany({}).exec();
    await mongoose.connection.close();
  });

  describe("Method Save", () => {
    it("should begin with no pcarts", (done) => {
      Cart.find({}).exec((_, users) => {
        expect(users.length).toEqual(0);
        done();
      });
    });

    it("should be able to save without problems", (done) => {
      const _cart1 = new Cart(cart1);

      _cart1.save((err) => {
        expect(err).toBeNull();
        Cart.deleteOne({ _id: _cart1._id }, (err: CallbackError) => {
          expect(err).toBeNull();
          done();
        });
      });
    });
  });
});
