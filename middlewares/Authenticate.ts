
import { NextFunction, Response, Request } from 'express';
import { Vendor } from '../models';
import { AuthPayload } from '../dto/auth.dto';
import { Customer } from '../models/Customer';
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

        let user: any;
        if (payload.type === "vendor") {
            user = await Vendor.findById(payload._id)
        } else {
            user = await Customer.findById(payload._id)
        }
        if (!user) {
            res.status(403).json({ message: "unauthenticated!" })
            return
        }
        req.user = payload;
        next();
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const isVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(403).json({ message: "unauthenticated!" });
            return;
        }

        let userDoc: any;
        if (user.type === "vendor") {
            userDoc = await Vendor.findById(user._id);
        } else {
            userDoc = await Customer.findById(user._id);
        }

        if (!userDoc || !userDoc.verified) {
            res.status(403).json({ message: "User is not verified!" });
            return;
        }

        next();
    } catch (error) {
        console.log((error as Error).message);
        res.status(400).json({ message: (error as Error).message });
    }
};