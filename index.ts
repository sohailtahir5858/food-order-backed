import express from 'express'
import bodyParser from 'body-parser'

require('dotenv').config()

import { AdminRoutes, VendorRoutes } from "./routes"
import { connectToDatabase } from './config/database'
const app = express()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/admin", AdminRoutes)
app.use("/vendor", VendorRoutes)


const start = async () => {
    try {
        console.clear();
        await connectToDatabase(MONGO_URI);
        app.listen(PORT, () => {
            console.log(`app running on ${PORT} port...`);
        })
    } catch (error) {
        console.log(error.message);
    }
}

start()