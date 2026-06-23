import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import cloudinary from "../service/cloudinary.service.js";
import UserAndGroupAdmin from "../models/user&group_admin.model.js";

export const addUserAdminList = async (req, res) => {
    const { adminDecidedName, email } = req.body;
    const adminId = req.user._id;
    try {
        const userExist = await User.findOne({ email });

        if (!userExist) return res.status(400).json({ message: "User not Exist" });

        const userId = userExist._id;

        const admin = await User.findByIdAndUpdate(
            adminId,
            {
                $set: { adminDecideName: adminDecidedName },
                $addToSet: { userIds: userId },
            },
            { returnDocument: "after" },
        );

        await UserAndGroupAdmin.create({
            adminId,
            adminType: "User",
            groupOrUserChatId: userId,
            groupOrUserChatType: "Private",
        });

        if (!admin) return res.status(400).json({ message: "Admin not Exist" });

        res.status(200).json({ message: "User added successfully", admin });
    } catch (error) {
        res
            .status(400)
            .json({ message: `Somthing went problem to add User: ${error.message}` });
    }
};

export const getUsersAndGroupsAdminList = async (req, res) => {
    const currUserId = req.user._id;

    const adminList = await User.aggregate([
        {
            $match: { _id: currUserId },
        },

        {
            $facet: {
                managedUsers: [
                    {
                        $lookup: {
                            from: "userandgroupadmins",
                            pipeline: [
                                {
                                    $match: {
                                        adminId: currUserId,
                                        groupOrUserChatType: "Private",
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "groupOrUserChatId",
                                        foreignField: "_id",
                                        as: "details",
                                    },
                                },
                                { $unwind: "$details" },
                            ],
                            as: "adminData",
                        },
                    },
                    { $unwind: "$adminData" },
                    {
                        $project: {
                            _id: 0,
                            id: "$adminData.groupOrUserChatId",
                            type: { $literal: "User" },
                            displayName: "$adminData.details.userName",
                            displayPhoto: "$adminData.details.userPhoto",
                        },
                    },
                ],

                managedGroups: [
                    {
                        $lookup: {
                            from: "userandgroupadmins",
                            pipeline: [
                                {
                                    $match: {
                                        adminId: currUserId,
                                        groupOrUserChatType: "Group",
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "groups",
                                        localField: "groupOrUserChatId",
                                        foreignField: "_id",
                                        as: "details",
                                    },
                                },
                                { $unwind: "$details" },
                            ],
                            as: "adminData",
                        },
                    },
                    { $unwind: "$adminData" },
                    {
                        $project: {
                            _id: 0,
                            id: "$adminData.groupOrUserChatId",
                            type: { $literal: "Group" },
                            displayName: "$adminData.details.groupName",
                            displayPhoto: "$adminData.details.groupIcon",
                        },
                    },
                ],

                adminJoinedGroup: [
                    {
                        $lookup: {
                            from: "groupmembers",
                            pipeline: [
                                { $match: { memberId: currUserId } },
                                {
                                    $lookup: {
                                        from: "groups",
                                        localField: "groupId",
                                        foreignField: "_id",
                                        as: "groupInfo",
                                    },
                                },
                                { $unwind: "$groupInfo" },
                            ],
                            as: "memberData",
                        },
                    },
                    { $unwind: "$memberData" },
                    {
                        $project: {
                            _id: 0,
                            id: "$memberData.groupInfo._id",
                            type: { $literal: "Group" },
                            displayName: "$memberData.groupInfo.groupName",
                            displayPhoto: "$memberData.groupInfo.groupIcon",
                        },
                    },
                ],
            },
        },

        {
            $project: {
                allManagedUandG: {
                    $concatArrays: [
                        "$managedUsers",
                        "$managedGroups",
                        "$adminJoinedGroup",
                    ],
                },
            },
        },
    ]);

    const finalResult = adminList[0].allManagedUandG;
    if (finalResult.length <= 0) {
        return res
            .status(200)
            .json({ message: "you are not create any group or not add any users!" });
    }

    res.status(200).json({ message: "result", finalResult });
};

export const getTheMessgesSAndR = async (req, res) => {
    try {
        const admin = req.user;
        const { receiverId, chatType } = req.query;

        if (!admin._id || !receiverId) {
            return res.status(400).json({ message: "Id's missing" });
        }

        const mongoAId = new mongoose.Types.ObjectId(admin._id);
        const mongoUId = new mongoose.Types.ObjectId(receiverId);
        let chatHistory;

        if (chatType === "Group") {
            chatHistory = await Message.aggregate([
                { $match: { reciverId: mongoUId, chatType: "Group" } },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "users",
                        localField: "senderId",
                        foreignField: "_id",
                        as: "senderDetails"
                    }
                },
                {
                    $addFields: {
                        senderDetails: { $arrayElemAt: ["$senderDetails", 0] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        senderId: 1,
                        reciverId: 1,
                        messageType: 1,
                        chatType: 1,
                        content: 1,
                        createdAt: 1,
                        senderName: "$senderDetails.userName",
                        email: "$senderDetails.email",
                        lastSeen: "$senderDetails.lastSeen"
                    }
                }
            ]);
        } else {
            chatHistory = await Message.find({
                chatType: "User",
                $or: [
                    { senderId: mongoAId, reciverId: mongoUId },
                    { senderId: mongoUId, reciverId: mongoAId },
                ],
            }).sort({ createdAt: 1 });
        }

        console.log(chatHistory)
        res
            .status(200)
            .json({ message: "successfully fetched chatHistory", chatHistory });
    } catch (error) {
        res.status(400).json({ message: "Admin not get messages: ", error });
    }
};

// export const mediaHandler = async (req, res) => {
//     const filePath = req.file;

//     if (!req.file || !req.file.buffer) {
//         return res.status(400).json({
//             success: false,
//             message: "Bhidu, lagta hai frontend se file sahi se aayi nahi!"
//         });
//     }

//     try {

//         const b64 = Buffer.from(req.file.buffer).toString("base64");
//         const dataURI = `data:${req.file.mimetype};base64,${b64}`;

//         const result = await cloudinary.uploader.upload(dataURI, {
//             folder: "media",
//             resource_type: "auto"
//         })

//         if (result) {
//             console.log('result: ', result)
//         }
//     } catch (error) {
//         res.status(400).json({ message: "something went wrong inside mediaHandler: ", error })
//     }
// }
