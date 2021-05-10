import type { Express } from "express";
import cartsPolicy from "../carts/policies/carts.policy.js";
import cartsRoutes from "../carts/routes/carts.routes.js";
import paypalPolicy from "../payments/policies/paypal.policy.js";
import stripePolicy from "../payments/policies/stripe.policy.js";
import paypalRoutes from "../payments/routes/paypal.routes.js";
import stripeRoutes from "../payments/routes/stripe.routes.js";
import productsPolicy from "../products/policies/products.policy.js";
import productsRoutes from "../products/routes/products.routes.js";
import usersPolicy from "../users/policies/users.policy.js";
import usersRoutes from "../users/routes/users.routes.js";

/**
 * Configure the modules ACL policies
 */
export const initModulesServerPolicies = () => {
  const policies = [
    cartsPolicy,
    paypalPolicy,
    stripePolicy,
    productsPolicy,
    usersPolicy,
  ];

  policies.map((policy) => policy.invokeRolesPolicies());
};

/**
 * Configure the modules server routes
 */
export const initModulesServerRoutes = (app: Express) => {
  const routes = [
    cartsRoutes,
    paypalRoutes,
    stripeRoutes,
    productsRoutes,
    usersRoutes,
  ];
  routes.map((route) => route(app));
};
