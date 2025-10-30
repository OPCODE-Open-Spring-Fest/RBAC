// src/validations/rbacValidation.js
import Joi from "joi";

const adminAccessSchema = Joi.object({
  authorization: Joi.string()
    .pattern(/^Bearer\s.+$/)
    .required()
    .messages({
      "string.pattern.base": "Authorization header must be in Bearer token format",
      "string.empty": "Authorization token is required",
    }),
}).unknown(true); // allows other headers

const userAccessSchema = Joi.object({
  authorization: Joi.string()
    .pattern(/^Bearer\s.+$/)
    .required()
    .messages({
      "string.pattern.base": "Authorization header must be in Bearer token format",
      "string.empty": "Authorization token is required",
    }),
}).unknown(true);

export { adminAccessSchema, userAccessSchema };
