const express = require('express')

const route = express.Router();

// route.get("/pincode")

route.get("/", (req, res) => {
    console.log("hit")
    res.status(200).send("asd")
})

export { route as FoodRoutes }