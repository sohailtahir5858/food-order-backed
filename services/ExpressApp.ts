import express, { Application } from 'express'
import bodyParser from 'body-parser'
import path from 'path'
require('dotenv').config()

import { AdminRoutes, VendorRoutes, ShoppingRoutes, CustomerRoutes } from "../routes"

// Creates folder if it doesn't exist
const uploadDir = path.join(__dirname, 'images');


export default async (app: Application) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('image', express.static(uploadDir));

    app.use("/admin", AdminRoutes);
    app.use("/vendor", VendorRoutes);
    app.use("/shopping", ShoppingRoutes);
    app.use("/customer", CustomerRoutes);
    return app;
}
