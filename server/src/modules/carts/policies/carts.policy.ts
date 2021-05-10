import {isAuthorized} from "../../core/utils.js";
import type {RequestHandler} from "express"
import Acl from "acl";
let acl = new Acl(new Acl.memoryBackend());

export const invokeRolesPolicies = () => {
  acl.allow([
    {
      roles : [ "guest" ],
      allows : [
        {resources : "/api/carts", permissions : "post"},
        {resources : "/api/carts/expire", permissions : "*"},
        {resources : "/api/carts/cleanup", permissions : "*"},
        {resources : "/api/carts/delete-expired", permissions : "*"},
        {resources : "/api/carts/:cartId", permissions : "*"},
        {resources : "/api/carts/check/:cartId", permissions : "*"},
        {resources : "/api/carts/:cartId/item/:sku", permissions : "*"},
      ],
    },
    {
      roles : [ "admin" ],
      allows : [ {resources : "/api/carts", permissions : "*"} ],
    },
  ]);
};
export const isAllowed: RequestHandler = function(req, res, next) {
  const roles = isAuthorized(req) ? [ "guest", "admin" ] : [ "guest" ];
  // TODO: make /api/carts restricted
  acl.areAnyRolesAllowed(
      roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
        if (err) {
          return res.status(500).send("Unexpected authorization error");
        } else if (isAllowed) {
          return next();
        } else {
          return res.status(403).json({
            message : "User is not authorized",
          });
        }
      });
};

export default {invokeRolesPolicies, isAllowed};
