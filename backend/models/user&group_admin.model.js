import mongoose from "mongoose";

const userAndGroupAdminSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'adminType',
        required: true,
    },
    adminType: {
        type: String,
        enum: ["User", "Group"],
        required: true
    },

    groupOrUserChatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    groupOrUserChatType: {
        type: String,
        enum: ["Group", "Private"]
    },
})


const UserAndGroupAdmin = mongoose.model("UserAndGroupAdmin", userAndGroupAdminSchema);

export default UserAndGroupAdmin;