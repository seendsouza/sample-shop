import productsPolicy from "../policies/products.policy.js";
import productsValidation from "../validation/products.validation.js";
import products from "../controllers/products.controller.js";
import type { Express } from "express";

export default (app: Express) => {
  app
    .route("/api/products")
    .all(productsValidation.isValid)
    .all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);
  app
    .route("/api/products/:id")
    .all(productsValidation.isValid)
    .all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.deleteProduct);
  app.param("id", products.productById);
};
