import Ajv from "ajv";
import { createValidator, Candidate } from "../../core/utils.js";
import schemaAddItem from "./addItem.schema.js";
import schemaUpdateItem from "./updateItem.schema.js";
const ajv = new Ajv();

const validateAddItem = ajv.compile(schemaAddItem);
const validateUpdateItem = ajv.compile(schemaUpdateItem);

const cartsValidation: Candidate[] = [
  {
    path: "/api/carts/:cartId/item/:sku",
    method: "POST",
    validator: validateAddItem,
  },
  {
    path: "/api/carts/:cartId/item/:sku",
    method: "PUT",
    validator: validateUpdateItem,
  },
];

export const isValid = createValidator(cartsValidation);

export default { isValid };
