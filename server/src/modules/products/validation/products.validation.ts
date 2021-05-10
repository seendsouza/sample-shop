import { createValidator, Candidate } from "../../core/utils.js";
import Ajv from "ajv";
import schema_product from "./product.schema.js";
const ajv = new Ajv();

const validateProduct = ajv.compile(schema_product);

const productsValidation: Candidate[] = [
  {
    path: "/api/products",
    method: "POST",
    validator: validateProduct,
  },
  {
    path: "/api/products/:id",
    method: "PUT",
    validator: validateProduct,
  },
];

export const isValid = createValidator(productsValidation);

export default { isValid };
