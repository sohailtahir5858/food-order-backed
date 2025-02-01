import express, { Request, Response, NextFunction } from 'express';

const route = express.Router();

route.get("/", (req:Request, res:Response, next: NextFunction) => {
    console.log("vendor routes")
    res.status(200).send("success")
})

export { route as VendorRoutes }