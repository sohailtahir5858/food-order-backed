import expressApp from './services/ExpressApp'
import connectToDatabase from './services/Database'
import express from 'express';
require('dotenv').config()


const PORT = process.env.PORT

const start = async () => {
    try {
        console.clear();
        const app = express()
        await connectToDatabase();
        await expressApp(app);

        app.listen(PORT, () => {
            console.log(`app running on ${PORT} port...`);
        })
    } catch (error) {
        console.log(error.message);
    }
}

start()