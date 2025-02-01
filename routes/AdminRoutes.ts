import express, { Request, Response, NextFunction } from "express";
import { createVendor, getVendors, getVendor } from "../controllers";

const route = express.Router();

route.post("/vendor/create", createVendor)
route.get("/vendor/fetch-all", getVendors)
route.get("/vendor/fetch/:id", getVendor)

route.get("/", (req: Request, res: Response, next: NextFunction) => {
    console.log("admin hit")
    res.status(200).send("success")
})


export { route as AdminRoutes }