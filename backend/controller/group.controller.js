import mongoose from "mongoose";
import Group from "../models/group.model.js";
import UserAndGroupAdmin from "../models/user&group_admin.model.js";
import GroupMember from "../models/groupMember.model.js";

export const createGroup = async (req, res) => {
    const adminId = req.user._id;

    try {
        const { groupName, groupIcon, groupMembers } = req.body;

        const alreadyExist = await Group.findOne({ groupName });

        if (alreadyExist)
            return res.status(400).json({ message: "This group already exist!" });

        if (groupMembers.length < 3) {
            res.status(400).json({ message: "Group members must be greater than 3" });
        }

        const newGroup = await Group.create({
            groupName,
            groupIcon,
            createdAt: Date.now()
        });

        const createGroupMembers = groupMembers.map((member) => {
            const memberId = new mongoose.Types.ObjectId(member);
            return {
                groupId: newGroup._id,
                memberId,
                role: "member",
                joinAt: Date.now(),
            };
        });

        await Promise.all([

            UserAndGroupAdmin.create({
                adminId,
                adminType: "Group",
                groupOrUserChatId: newGroup._id,
                groupOrUserChatType: "Group",
            }),

            GroupMember.insertMany(createGroupMembers)
        ])

        res.status(200).json({ message: "group created successfully", newGroup });
    } catch (error) {
        res.status(400).json({
            message: `Something Went wrong In the Creating Group: ${error.message}`,
        });
        console.log(`Something Went wrong In the Creating Group: ${error.message}`);
    }
};

export const getValidAdminGroups = async (req, res) => {
    const adminId = req.user._id;

    try {
        const groups = await Group.find({ groupAdmin: adminId });

        if (groups.length === 0) {
            return res
                .status(200)
                .json({ message: "You are not creating any group!" });
        }

        res.status(200).json({ message: "fetch group!", groups });
    } catch (error) {
        res.status(400).json({
            message: `something went wrong in you get group: ${error.message}`,
        });
    }
};
