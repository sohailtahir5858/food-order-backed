const bcrypt = require("bcrypt")

export const generateSalt = async() => {
    return await bcrypt.genSalt(10);
}

export const encryptPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt)
}