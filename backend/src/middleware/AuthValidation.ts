import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const signUpValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password:Joi.string().min(6).max(100).required(),
  });
  const {error}=userSchema.validate(req.body);
  if(error){
    res.status(400).send({ message:  error.details[0].message, success: false });
    return;
  }
  next();
};

const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email().required(),
    password:Joi.string().min(6).max(100).required()
  });
  const {error}=userSchema.validate(req.body);
  if(error){
    res.status(400).send({ message: error.details[0].message, success: false });
  }else{
    next();
  }
};

export {
  loginValidation,signUpValidation
}