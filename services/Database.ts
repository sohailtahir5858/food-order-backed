import mongoose from 'mongoose'

require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI

export default async () => {
    try {
        await mongoose.connect(MONGO_URI, {})
    } catch (error) {
        console.log((error as Error).message);
    }
}
