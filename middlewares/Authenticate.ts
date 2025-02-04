
import { NextFunction, Response, Request } from 'express';
import { Vendor } from '../models';
import { AuthPayload } from '../dto/auth.dto';
const jwt = require("jsonwebtoken")

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            res.status(403).json({ message: "unauthenticated!" })
            return
        }

        const token = authHeader.split("Bearer ")[1] ?? null;
        if (!token) {
            res.status(403).json({ message: "unauthenticated!" })
            return
        }

        const payload = await jwt.verify(token, process.env.JWT_SECRET) as AuthPayload;
        const user = await Vendor.findById(payload._id)
        if (!user) {
            res.status(403).json({ message: "unauthenticated!" })
            return
        }
        req.user = payload;
        next();
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}