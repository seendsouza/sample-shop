import usersPolicy from "../policies/users.policy.js";
import users from "../controllers/users.controller.js";
import usersValidation from "../validation/users.validation.js";
import type { Express } from "express";

export default (app: Express) => {
  app
    .route("/api/users")
    .all(usersValidation.isValid)
    .all(usersPolicy.isAllowed)
    .post(users.signUp)
    .put(users.login);
  app
    .route("/api/users/token")
    .all(usersPolicy.isAllowed)
    .get(users.checkToken);
};
