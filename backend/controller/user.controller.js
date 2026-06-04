import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import mongoose from "mongoose"

export const getTheUser = async (req, res) => {

    const userId = req.user.id

    console.log("userId", userId)
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        res.status(200).json({ message: "User found successfully", user })
    } catch (error) {
        res.status(400).json({ message: `User not found: ${error.message}` })
    }
}

export const addUserAdminList = async (req, res) => {
    const { adminDecidedName, email } = req.body;

    try {

        const userExist = await User.findOne({ email });

        if (!userExist) return res.status(400).json({ message: "User not Exist" })

        const userId = userExist._id;

        const admin = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { adminDecideName: adminDecidedName },
                $addToSet: { userIds: userId }
            },
            { returnDocument: "after" }
        )

        if (!admin) return res.status(400).json({ message: "Admin not Exist" })

        res.status(200).json({ message: "User added successfully", admin })
    } catch (error) {
        res.status(400).json({ message: `Somthing went problem to add User: ${error.message}` })
    }
}

export const getUsersInAdminList = async (req, res) => {
    const currAdmin = req.user;

    try {

        if (!currAdmin) return res.status(400).json({ message: "Admin not found" })

        if (!currAdmin.userIds.length > 0) return res.status(201).json({ message: "You are not added users" })

        const allUsers = await User.find(
            { _id: { $in: currAdmin.userIds } }
        )

        res.status(200).json({ message: "user found successfully", allUsers })
    } catch (error) {
        res.status(400).json({ message: `Soemthing went error to get all users: ${error.message}` })
    }
}

export const getTheMessgesSAndR = async (req, res) => {
    try {
        const adminId = req.user._id
        const { reciverId } = req.params

        if (!adminId || !reciverId) {
            return res.status(400).json({ message: "Id's missing" })
        }

        const mongoAId = new mongoose.Types.ObjectId(adminId)
        const mongoUId = new mongoose.Types.ObjectId(reciverId)

        const chatHistory = await Message.find({
            $or: [
                { senderId: mongoAId, reciverId: mongoUId },
                { senderId: mongoUId, reciverId: mongoAId }
            ]
        }).sort({createdAt: 1})

        res.status(200).json({ message: 'sccussefully fetched chatHistory', chatHistory })
    } catch (error) {
        res.status(400).json({ message: "Admin not get messages: ", error })
    }
}