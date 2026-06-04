import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const userValidation = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized User Invalid token" })
    }

    try {
        const decode = jwt.verify(token, 'JWT-SECRET')

        const userId = decode.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(400).json({ message: `Unauthorized user: ${error.message}` })
    }
}