import { createValidator, Candidate } from "../../core/utils.js";
import Ajv from "ajv";
import schema_login from "./user.schema.js";
const ajv = new Ajv();

const validateLogin = ajv.compile(schema_login);

const usersValidation: Candidate[] = [
  {
    path: "/api/users",
    method: "PUT",
    validator: validateLogin,
  },
];

export const isValid = createValidator(usersValidation);

export default { isValid };
