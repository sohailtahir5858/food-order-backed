import express, { Request, Response, NextFunction } from "express";
import { createVendor, getVendors, getVendor } from "../controllers";

const route = express.Router();

route.get("/vendor/:id", getVendor)
route.get("/vendors", getVendors)
route.post("/vendor", createVendor)

export { route as AdminRoutes }