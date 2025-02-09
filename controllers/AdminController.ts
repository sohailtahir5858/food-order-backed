import { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { isValidObjectId } from 'mongoose';

export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, address, pincode, email, foodType, password, ownerName, phone } = <CreateVendorInput>req.body;
        const vendor = await Vendor.create({
            name,
            address,
            pincode,
            email,
            password,
            foodType,
            ownerName,
            phone,
            serviceAvailable: false,
            coverImages: [],
            rating: 0,
            foods: []
        })
        res.status(200).json(vendor)
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const getVendors = async (req: Request, res: Response, next: NextFunction) => {
    console.log("getVendors hit");
    const vendors = await Vendor.find({});
    res.status(200).json({ success: true, vendors })
}

export const getVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        if (!id || !isValidObjectId(id)) {
            res.status(404).json({ "message": "Invalid key provided" })
            return
        }

        const vendor = await Vendor.findById(id)
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
            return
        }

        res.status(200).json({ success: true, vendor })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}
