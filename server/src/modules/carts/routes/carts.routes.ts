import cartsPolicy from "../policies/carts.policy.js";
import cartsValidation from "../validation/carts.validation.js";
import carts from "../controllers/carts.controller.js";
import products from "../../products/controllers/products.controller.js";
import type { Express } from "express";

export default (app: Express) => {
  app
    .route("/api/carts")
    .all(cartsPolicy.isAllowed)
    .get(carts.list)
    .post(carts.create);
  app.route("/api/carts/expire").all(cartsPolicy.isAllowed).get(carts.expire);
  app.route("/api/carts/cleanup").all(cartsPolicy.isAllowed).get(carts.cleanup);
  app
    .route("/api/carts/delete-expired")
    .all(cartsPolicy.isAllowed)
    .get(carts.deleteExpired);
  app.route("/api/carts/:cartId").all(cartsPolicy.isAllowed).get(carts.read);

  app
    .route("/api/carts/check/:cartId")
    .all(cartsPolicy.isAllowed)
    .get(carts.check);

  app
    .route("/api/carts/:cartId/item/:sku")
    .all(cartsValidation.isValid)
    .all(cartsPolicy.isAllowed)
    .post(carts.addItem)
    .put(carts.updateItem)
    .delete(carts.deleteItem);

  app.param("cartId", carts.cartById);
  app.param("sku", products.productById);
};
