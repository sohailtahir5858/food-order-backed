const mongoose = require('mongoose')

export const connectToDatabase = async (Uri) => {
    try {
        return mongoose.connect(Uri, {
        })
    } catch (error) {
        console.log(error.message)
    }
}