import jwt from 'jsonwebtoken';
import User from "../models/user.model.js"
import cookie from "cookie"

export const socketValidation = async (socket, next) => {

    let token = null;

    const headerCookie = socket.handshake.headers.cookie;

    if (headerCookie) {
        const cookies = cookie.parse(headerCookie)
        token = cookies.token;
    }

    if (!token) {
        token = socket.handshake.auth.token || socket.handshake.headers["authorization"]
    }

    if (!token) {
        return next(new Error("Authentication error: Token missing"));
    }

    try {
        const decode = jwt.verify(token, 'JWT-SECRET');

        const admin = await User.findById(decode.id)

        if (!admin) {
            next(new Error("User not found"))
        }

        socket.adminId = admin._id.toString();

        next();
    } catch (error) {
        return next(new Error("Authentication error: Invalid token", error.message))
    }

}