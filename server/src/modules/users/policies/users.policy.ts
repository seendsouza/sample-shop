import type { RequestHandler } from "express";
import { isAuthorized } from "../../core/utils.js";
import Acl from "acl";
let acl = new Acl(new Acl.memoryBackend());
export const invokeRolesPolicies = () => {
  acl.allow([
    {
      roles: ["guest"],
      allows: [{ resources: "/api/users", permissions: "put" }],
    },
    {
      roles: ["admin"],
      allows: [{ resources: "/api/users/token", permissions: "*" }],
    },
  ]);
};
export const isAllowed: RequestHandler = function (req, res, next) {
  if (req.route.path === "/api/users" && req.method == "POST")
    return process.env.NODE_ENV === "production" ? res.sendStatus(404) : next();
  const roles = isAuthorized(req) ? ["guest", "admin"] : ["guest"];
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
