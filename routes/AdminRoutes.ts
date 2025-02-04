import express, { Request, Response, NextFunction } from "express";
import { createVendor, getVendors, getVendor } from "../controllers";

const route = express.Router();

route.get("/vendors", getVendors)
route.get("/vendors/:id", getVendor)
route.post("/vendor", createVendor)

export { route as AdminRoutes }