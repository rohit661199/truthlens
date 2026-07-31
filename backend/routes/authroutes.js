import express from "express"
import {  signin, signup,googleAuth,sendOtp,verifyOtp,resetPassword } from "../controllers/authcontroller.js"
const authRouter=express.Router()
 authRouter.post("/signup",signup)
 authRouter.post("/signin",signin)
authRouter.post("/send-otp",sendOtp)
 authRouter.post("/verify-otp",verifyOtp)
 authRouter.post("/reset-password",resetPassword)
  authRouter.post("/google-auth",googleAuth)
 
  



 export default authRouter