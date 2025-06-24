import Joi from "joi";

export const signUpSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(50).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
  role: Joi.string().valid("user", "vendor").default("user"),

  companyName: Joi.when("role", {
    is: "vendor",
    then: Joi.string().min(2).required().messages({
      "any.required": "Company name is required for vendors",
    }),
    otherwise: Joi.forbidden(),
  }),

  businessAddress: Joi.when("role", {
    is: "vendor",
    then: Joi.string().min(5).required().messages({
      "any.required": "Business address is required for vendors",
    }),
    otherwise: Joi.forbidden(),
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(50).required(),
});
