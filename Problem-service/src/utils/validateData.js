import Joi from 'joi';

export const validateCreateProblem = (data) => {
  const schema = Joi.object({
    user: Joi.string()
      .required()
      .messages({
        "string.base": `"user" should be a type of 'text'`,
        "string.empty": `"user" cannot be an empty field`,
        "any.required": `"user" is a required field`,
      }),
    title: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.base": `"title" should be a type of 'text'`,
        "string.empty": `"title" cannot be an empty field`,
        "string.min": `"title" should have a minimum length of {#limit}`,
        "string.max": `"title" should have a maximum length of {#limit}`,
        "any.required": `"title" is a required field`,
      }),
    description: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        "string.base": `"description" should be a type of 'text'`,
        "string.empty": `"description" cannot be an empty field`,
        "string.min": `"description" should have a minimum length of {#limit}`,
        "string.max": `"description" should have a maximum length of {#limit}`,
        "any.required": `"description" is a required field`,
      }),
    datastructure: Joi.string()
      .required()
      .messages({
        "string.base": `"datastructure" should be a type of 'text'`,
        "string.empty": `"datastructure" cannot be an empty field`,
        "any.required": `"datastructure" is a required field`,
      }),
    algorithm: Joi.string()
      .required()
      .messages({
        "string.base": `"algorithm" should be a type of 'text'`,
        "string.empty": `"algorithm" cannot be an empty field`,
        "any.required": `"algorithm" is a required field`,
      }),
    sourcelink: Joi.string()
      .uri()
      .required()
      .messages({
        "string.base": `"sourcelink" should be a type of 'text'`,
        "string.empty": `"sourcelink" cannot be an empty field`,
        "string.uri": `"sourcelink" should be a valid URI`,
        "any.required": `"sourcelink" is a required field`,
      }),
    notes: Joi.string()
      .max(500)
      .optional()
      .messages({
        "string.base": `"notes" should be a type of 'text'`,
        "string.max": `"notes" should have a maximum length of {#limit}`,
      }),
  });

  return schema.validate(data);
};
