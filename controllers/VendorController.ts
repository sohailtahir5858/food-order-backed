import { Request, Response, NextFunction } from 'express';
import { Vendor as VendorModel } from '../models';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("login hit");
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ "message": "Email & Password are required!" })
            return
        }
        const vendor = await VendorModel.findOne({ email })
        if (!vendor || !(await vendor.comparePassword(password))) {
            res.status(404).json({ message: "Vendor not found" });
            return
        }
        const token = await vendor.createToken();
        res.status(200).json({ vendor, token })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}