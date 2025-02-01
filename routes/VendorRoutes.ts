import express, { Request, Response, NextFunction } from 'express';
import { login } from '../controllers';

const route = express.Router();

route.post("/login", login)

route.get("/", (req:Request, res:Response, next: NextFunction) => {
    res.status(200).send("success")
})

export { route as VendorRoutes }