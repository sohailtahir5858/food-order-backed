const bcrypt = require("bcrypt")

export const generateSalt = async () => {
    return await bcrypt.genSalt(10);
}

export const encryptPassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (candidatePassword: string, password: string) => {
    return await bcrypt.compare(candidatePassword, password)
}