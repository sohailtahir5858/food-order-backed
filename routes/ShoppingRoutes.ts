import { GetFoodAvailability, GetFoodsIn30Min, GetTopRestaurants, RestaurantById, SearchFoods } from "../controllers";

const express = require('express')

const route = express.Router();

route.get("/:pincode", GetFoodAvailability)
route.get("/top-restaurants/:pincode", GetTopRestaurants)
route.get('/foods-in-30-min/:pincode', GetFoodsIn30Min)
route.post('/search-food', SearchFoods)
route.get('/restaurant/:pincode', RestaurantById)

export { route as ShoppingRoutes }