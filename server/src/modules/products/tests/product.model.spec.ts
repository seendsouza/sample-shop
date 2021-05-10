import type { CallbackError } from "mongoose";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

describe("Product Model Unit Tests:", () => {
  let product1: Object;
  beforeAll(async () => {
    const url = process.env.MONGO_URL;
    if (!url) process.exit(1);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
  });

  afterAll(async () => {
    await Product.deleteMany({}).exec();
    await mongoose.connection.close();
  });

  describe("Method Save", () => {
    it("should begin with no products", (done) => {
      Product.find({}).exec((_, users) => {
        expect(users.length).toEqual(0);
        done();
      });
    });

    it("should be able to save without problems", (done) => {
      const _product1 = new Product(product1);

      _product1.save((err) => {
        expect(err).toBeNull();
        Product.deleteOne({ name: _product1.name }, (err: CallbackError) => {
          expect(err).toBeNull();
          done();
        });
      });
    });
  });
});
