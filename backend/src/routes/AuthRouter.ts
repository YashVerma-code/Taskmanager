import express from "express"
import { loginValidation, signUpValidation } from "../middleware/AuthValidation";
import { login, signUp } from "../controllers/AuthController";
const router =express.Router()

router.post("/login",loginValidation,login);

router.post("/signup",signUpValidation,signUp);

export default router;