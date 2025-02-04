import express, { Request, Response, NextFunction } from 'express';
import { createFood, getFoods, getVendorProfile, login, updateVendorCoverImages, updateVendorProfile, updateVendorService } from '../controllers';
import { authenticate } from '../middlewares';
import multer from 'multer'

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().toISOString()}_${file.originalname}`.replace(/:/g, '-'))
    }
})

const images = multer({ storage: imageStorage }).array('images', 10)
const route = express.Router();

route.post("/login", login)


route.get("/profile", authenticate, getVendorProfile)
route.patch("/profile", authenticate, updateVendorProfile)
route.patch("/service", authenticate, updateVendorService)
route.patch("/cover-images", authenticate, images, updateVendorCoverImages)

route.post("/food", authenticate, images, createFood);
route.get("/foods", authenticate, getFoods);


export { route as VendorRoutes }