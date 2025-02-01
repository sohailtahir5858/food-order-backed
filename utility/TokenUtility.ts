const jwt = require("jsonwebtoken")
export const createToken = async (id, name, email) => {
    return await jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}