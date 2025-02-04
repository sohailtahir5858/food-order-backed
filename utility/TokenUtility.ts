import { AuthPayload } from "../dto/auth.dto"

const jwt = require("jsonwebtoken")
export const createToken = async (payload: AuthPayload) => {
    return await jwt.sign({ ...payload }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export const verifyToken = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET)
}