import Joi from "joi";
//joi The most powerful schema description language and data validator for JavaScript.

export const validateRegisteration =(data)=>{
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required(),   
    })
    return schema.validate(data);
}