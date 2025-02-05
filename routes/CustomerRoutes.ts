import { customerLogin, requestOtp, customerSignup, customerVerify, getCustomerProfile, updateCustomerProfile } from "../controllers";
import { authenticate, isVerified } from "../middlewares";

const express = require('express')
const route = express.Router();

route.post("/signup", customerSignup);
route.post("/login", customerLogin);

route.post("/verify", authenticate, customerVerify);
route.get("/request-otp", authenticate, requestOtp);
route.get("/profile", authenticate, isVerified, getCustomerProfile)
route.patch("/profile", authenticate, isVerified, updateCustomerProfile);


export { route as CustomerRoutes }