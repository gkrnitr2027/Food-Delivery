import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createEditShop } from "../controllers/shop.controller.js"

const shopRouter = express.Router()

userRouter.get("/create-edit",isAuth, createEditShop)


export default shopRouter