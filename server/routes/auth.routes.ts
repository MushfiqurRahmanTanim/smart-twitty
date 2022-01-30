import { login, logout, signup } from "../controllers/auth.Controllers";
import express from "express";
import { signupValidator } from "../libs/ValidationSchema";

const router =express.Router();

router.post("/signup",signupValidator, signup)
router.post("/login",login)
router.delete("/logout",logout)


export default router