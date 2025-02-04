import { Request, Response, NextFunction } from 'express';
import { Food, Vendor as VendorModel } from '../models';
import { CreateFoodInputs, EditVendorInputs, EditVendorServiceInputs } from '../dto';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(404).json({ message: "user not found!" })
            return
        }

        const vendor = await VendorModel.findById(user._id)
        if (!vendor) {
            res.status(404).json({ message: "user not found!" })
            return
        }

        res.status(200).json({ vendor })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { name, address, phone, foodType } = <EditVendorInputs>req.body
        if (!user) {
            res.status(404).json({ message: "user not found!" })
            return
        }

        const vendor = await VendorModel.findById(user._id)
        if (!vendor) {
            res.status(404).json({ message: "user not found!" })
            return
        }
        console.log("hit here")
        vendor.name = name ?? vendor.name
        vendor.address = address ?? vendor.address
        vendor.phone = phone ?? vendor.phone
        vendor.foodType = foodType ?? vendor.foodType
        vendor.save()
        res.status(200).json({ message: "vendor profile updated!", vendor });
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { serviceAvailability } = <EditVendorServiceInputs>req.body
        if (!user) {
            res.status(404).json({ message: "invalid params!" })
            return
        }

        if (typeof serviceAvailability !== "boolean") {
            res.status(400).json({ message: "Invalid input! 'serviceAvailability' must be a boolean." });
        }

        const vendor = await VendorModel.findById(user._id)
        if (!vendor) {
            res.status(404).json({ message: "user not found!" })
            return
        }

        vendor.serviceAvailable = serviceAvailability
        vendor.save();
        res.status(200).json({ message: "vendor availability status updated!", vendor });
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const updateVendorCoverImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const vendor = await VendorModel.findById(user._id ?? "")
        if (!user || !vendor) {
            res.status(404).json({ message: "user not found!" })
            return
        }

        // Ensure `req.files` is correctly typed
        const files = req.files as Express.Multer.File[];
        console.log(files.length)
        if (!files || files.length === 0) {
            res.status(400).json({ message: "Cover Images are required!" });
            return;
        }

        // Correctly store filenames as an array
        const coverImages = files.map((file) => file.filename);
        console.log(coverImages)
        vendor.coverImages = coverImages;
        await vendor.save();
        res.status(200).json({ message: "vendor availability status updated!", vendor });
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const createFood = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const vendor = await VendorModel.findById(user._id ?? "")
        if (!user || !vendor) {
            res.status(404).json({ message: "user not found!" })
            return
        }

        const files = req.files as Express.Multer.File[]
        const images = files.map((file) => file.filename)
        const { name, category, description, foodType, readyTime, price } = <CreateFoodInputs>req.body
        const food = await Food.create({
            vendorId: vendor._id,
            name,
            category,
            description,
            foodType,
            readyTime,
            price,
            rating: 5,
            images: images
        })
        vendor.foods.push(food)
        vendor.save();
        res.status(200).json({ message: "food has been added!", result: vendor })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const vendor = await VendorModel.findById(user._id ?? "")
        if (!user || !vendor) {
            res.status(404).json({ message: "user not found!" })
            return
        }
        const food = await Food.find({ vendorId: vendor._id })
        res.status(200).json({ message: "success", foods: food })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}