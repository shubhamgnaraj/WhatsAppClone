import AdminStatus from "../models/status.model.js";
import { deleteMediaFromCloudinary, uploadMediaInCloudinary } from "../utility/handleCloudinaryMedia.utility.js";
import { fileTypeFromBuffer } from "file-type";
import { isAllowedType } from "../utility/fileValidator.utility.js";
import UserAndGroupAdmin from "../models/user&group_admin.model.js";
import UserStatus from "../models/status.model.js";

export const saveStatusDataInDB = async (req, res) => {
    const adminId = req.user._id;
    const { statusDescription } = req.body;
    let cloudinaryResult = null;

    if (!req.file) {
        return res.status(400).json({ message: "Please select the correct file" })
    }

    try {
        const typeResult = await fileTypeFromBuffer(req.file.buffer);
        if (!typeResult || !isAllowedType(typeResult.mime)) {
            return res.status(400).json({ message: "Invalid file Type!" });
        }

        try {
            cloudinaryResult = await uploadMediaInCloudinary(
                req.file.buffer,
                "statusMedia_folder",
            )
        } catch (cloudinaryError) {
            console.error("Cloudinary upload failed:", cloudinaryError)
            return res.status(502).json({ message: "Unable to upload the file" })
        }

        const { public_id, resource_type, secure_url } = cloudinaryResult;
        const newStatus = await AdminStatus.create({
            userId: adminId,
            publicId: public_id,
            mediaType: resource_type,
            mediaURL: secure_url,
            status: "uploaded",
            caption: statusDescription,
            createdAt: Date.now(),
        });

        return res
            .status(201)
            .json({ message: "Status data save Successfully! ", newStatus });

    } catch (error) {

        if (cloudinaryResult?.public_id) {
            try {
                await deleteMediaFromCloudinary(cloudinaryResult.public_id,
                    cloudinaryResult.resource_type)
            } catch (cleanUpError) {
                console.error("Cloudinary cleanup failed: ", cleanUpError)
            }
        }

        console.log(`Media is not saved in the DB: ${error.message}`)
        return res
            .status(500)
            .json({ message: `Media is not saved in the DB` });
    }
};

export const getUploadedUsersStatuses = async (req, res) => {
    const adminId = req.user._id;

    try {
        const uplodedStatusUsers = await UserAndGroupAdmin.aggregate([
            {
                $match: {
                    adminId: adminId,
                    groupOrUserChatType: "Private"
                }
            },
            {
                $lookup: {
                    from: "userstatuses",
                    let: {
                        userId: "$groupOrUserChatId"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$userId"]
                                }
                            }
                        },
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                                }
                            }
                        },

                        {
                            $count: "statusCount"
                        }
                    ],
                    as: "statusDetails"
                }
            },

            {
                $match: {
                    "statusDetails.0": {
                        $exists: true
                    }
                }
            },

            {
                $set: {
                    statusCount: {
                        $arrayElemAt: [
                            "$statusDetails.statusCount",
                            0
                        ]
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "groupOrUserChatId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },

            {
                $unwind: "$userDetails"
            },

            {
                $project: {
                    _id: 0,
                    userId: "$groupOrUserChatId",
                    userName: "$userDetails.userName",
                    userPhoto: "$userDetails.userPhoto",
                    statusCount: 1
                }
            }
        ]);

        return res.status(200).json({
            message: "Statuses fetched successfully",
            uplodedStatusUsers
        });

    } catch (error) {
        console.error("Unable to fetch user statuses:", error);

        return res.status(500).json({
            message: "Unable to fetch user statuses"
        });
    }
};

export const getUserStatus = async (req, res) => {
    const userId = req.params.userId;

    try {
        const userStatuses = await UserStatus.find({ userId, createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }).sort({ createdAt: "desc" });

        if (userStatuses.length === 0) {
            return res.status(400).json({ message: "Does not have a Status!" })
        }

        return res.status(200).json({ message: "fetch successfully Status", userStatuses })
    } catch (error) {
        res.status(400).json({ message: `Something went problem with UserStatus: ${error.message}` })
    }
}