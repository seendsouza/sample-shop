import type { RequestHandler } from "express";
import Acl from "acl";
let acl = new Acl(new Acl.memoryBackend());
export const invokeRolesPolicies = () => {
  acl.allow([
    {
      roles: ["guest"],
      allows: [
        {
          resources: "/api/payments/paypal/checkout/:cartId",
          permissions: "*",
        },
        { resources: "/api/payments/paypal/execute/:cartId", permissions: "*" },
        { resources: "/api/payments/paypal/cancel/:cartId", permissions: "*" },
      ],
    },
  ]);
};
export const isAllowed: RequestHandler = function (req, res, next) {
  const roles = true ? ["guest"] : ["guest", "admin"];
  // TODO: make /api/carts restricted
  acl.areAnyRolesAllowed(
    roles,
    req.route.path,
    req.method.toLowerCase(),
    (err, isAllowed) => {
      if (err) {
        return res.status(500).send("Unexpected authorization error");
      } else if (isAllowed) {
        return next();
      } else {
        return res.status(403).json({
          message: "User is not authorized",
        });
      }
    }
  );
};

export default { invokeRolesPolicies, isAllowed };
