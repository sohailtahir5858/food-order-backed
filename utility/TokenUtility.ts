const jwt = require("jsonwebtoken")
export const createToken = async (payload) => {
    return await jwt.sign({ ...payload }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export const verifyToken = async (token) => {
    return await jwt.verify(token, process.env.JWT_SECRET)
}