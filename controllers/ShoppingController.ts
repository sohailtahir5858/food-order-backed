import { Request, Response, NextFunction } from 'express';
import { FoodDoc, Vendor as VendorModel } from '../models';


export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        if (!pincode) {
            res.status(400).json({ message: "pincode is required" })
            return
        }

        const vendor = await VendorModel.find({ pincode: pincode, serviceAvailable: true })
            .sort('[rating, descending]')
            .populate("foods")

        console.log(pincode)
        res.status(200).json({ status: "success", result: vendor })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        if (!pincode) {
            res.status(400).json({ message: "pincode is required" })
            return
        }

        const vendor = await VendorModel.find({ pincode: pincode, serviceAvailable: true })
            .sort('[rating, descending]')
            .limit(2)
        if (vendor.length == 0) {
            res.status(404).json({ message: "Restaurants not found!" })
            return
        }
        res.status(200).json({ status: "success", result: vendor })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const GetFoodsIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        if (!pincode) {
            res.status(400).json({ message: "pincode is required" })
            return
        }

        const vendors = await VendorModel.find({ pincode: pincode, serviceAvailable: true })
            .sort('[rating, descending]')
            .populate("foods")
        if (vendors.length == 0) {
            res.status(404).json({ message: "Restaurants not found!" })
            return
        }
        let foods: FoodDoc[] = [];
        vendors.map((vendor) => {
            const filteredFood: FoodDoc[] = vendor.foods.filter((food) => food.readyTime <= 30)
            foods = [...foods, ...filteredFood]
        })
        foods.sort((a, b) => b.rating - a.rating)
        res.status(200).json({ status: "success", result: foods })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.body
        if (!search) {
            res.status(400).json({ message: "search term is required" })
            return
        }

        const vendors = await VendorModel.find({ serviceAvailable: true })
            .sort('[rating, descending]')
            .populate("foods")
        if (vendors.length == 0) {
            res.status(404).json({ message: "Restaurants not found!" })
            return
        }
        let foods: FoodDoc[] = [];
        vendors.map((vendor) => {
            const filteredFood: FoodDoc[] = vendor.foods.filter((food) => food.name.toLowerCase().includes(search.toLowerCase()))
            foods = [...foods, ...filteredFood]
        })
        foods.sort((a, b) => b.rating - a.rating)
        res.status(200).json({ status: "success", result: foods })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}

export const RestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        if (!pincode) {
            res.status(400).json({ message: "pincode is required" })
            return
        }

        const vendor = await VendorModel.find({ pincode: pincode, serviceAvailable: true })
            .sort('[rating, descending]')
            .limit(10)

        res.status(200).json({ status: "success", result: vendor })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ message: (error as Error).message })
    }
}